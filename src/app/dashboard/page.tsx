import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Users, Wallet, Shield } from "lucide-react";
import { StatCard } from "@/components/dashboard/dashboard/stat-card";
import { TribeDistributionChart } from "@/components/dashboard/dashboard/tribe-distribution-chart";
import { RecentSignups } from "@/components/dashboard/dashboard/recent-signups";

async function getDashboardData() {
  const supabase = createSupabaseServerClient();

  // 1. Encontrar a edição mais recente
  const { data: latestEdition, error: editionError } = await supabase
    .from("edicoes")
    .select("id, nome_edicao, taxa_inscricao")
    .order("numero_edicao", { ascending: false })
    .limit(1)
    .single();

  if (editionError || !latestEdition) {
    return { latestEdition: null };
  }

  const editionId = latestEdition.id;

  // 2. Obter contagens de pessoas
  const { data: peopleCounts, error: peopleError } = await supabase
    .from("pessoas")
    .select("tipo", { count: "exact" })
    .eq("edicao_id", editionId);

  const participantCount =
    peopleCounts?.filter((p: any) => p.tipo === "participante").length ?? 0;
  const teamCount =
    peopleCounts?.filter((p: any) => p.tipo === "equipe").length ?? 0;

  // 3. Obter total arrecadado
  const { data: payments, error: paymentError } = await supabase
    .from("pagamentos")
    .select("valor")
    .eq("edicao_id", editionId);

  const totalCollected =
    payments?.reduce((sum, p) => sum + parseFloat(p.valor), 0) ?? 0;

  // 4. Obter distribuição por tribo
  const { data: tribeDistribution, error: tribeError } = await supabase
    .from("pessoas")
    .select("tribos(nome)")
    .eq("edicao_id", editionId)
    .not("tribo_id", "is", null);

  const tribeData = tribeDistribution?.reduce((acc: any, curr: any) => {
    const tribeName = curr.tribos.nome;
    acc[tribeName] = (acc[tribeName] || 0) + 1;
    return acc;
  }, {});

  const chartData = tribeData
    ? Object.keys(tribeData).map((name) => ({
        name,
        total: tribeData[name],
      }))
    : [];

  // 5. Obter inscrições recentes
  const { data: recentSignups, error: signupsError } = await supabase
    .from("pessoas")
    .select("id, nome_completo, tipo, created_at")
    .eq("edicao_id", editionId)
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    latestEdition,
    stats: {
      participants: participantCount,
      team: teamCount,
      totalCollected,
    },
    chartData,
    recentSignups,
  };
}

export default async function DashboardHome() {
  const data = await getDashboardData();

  if (!data.latestEdition) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo!</h1>
        <p className="text-muted-foreground mb-4">
          Nenhuma edição de acampamento encontrada.
        </p>
        <Button asChild>
          <Link href="/dashboard/edicoes">Criar Primeira Edição</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Painel - {data.latestEdition.nome_edicao}
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Participantes"
          value={data.stats.participants.toString()}
          icon={Users}
        />
        <StatCard
          title="Equipe de Trabalho"
          value={data.stats.team.toString()}
          icon={Users}
        />
        <StatCard
          title="Total Arrecadado"
          value={new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(data.stats.totalCollected)}
          icon={Wallet}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Distribuição por Tribo
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TribeDistributionChart data={data.chartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Inscrições Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSignups signups={data.recentSignups || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}