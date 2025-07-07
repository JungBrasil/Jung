import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Wallet, Shield } from "lucide-react";
import { StatCard } from "@/components/dashboard/dashboard/stat-card";
import { TribeDistributionChart } from "@/components/dashboard/dashboard/tribe-distribution-chart";
import { RecentSignups } from "@/components/dashboard/dashboard/recent-signups";
import { EditionSelector } from "@/components/dashboard/dashboard/edition-selector";

async function getDashboardData(selectedEditionId?: string) {
  const supabase = createSupabaseServerClient();

  // 1. Obter todas as edições para o seletor
  const { data: allEditions, error: allEditionsError } = await supabase
    .from("edicoes")
    .select("id, nome_edicao")
    .order("numero_edicao", { ascending: false });

  if (allEditionsError || !allEditions || allEditions.length === 0) {
    return { allEditions: [] };
  }

  // 2. Determinar a edição a ser exibida
  let targetEdition;
  if (selectedEditionId) {
    const { data, error } = await supabase
      .from("edicoes")
      .select("id, nome_edicao, taxa_inscricao")
      .eq("id", selectedEditionId)
      .single();
    if (!error) targetEdition = data;
  }

  if (!targetEdition) {
    targetEdition = await supabase
      .from("edicoes")
      .select("id, nome_edicao, taxa_inscricao")
      .order("numero_edicao", { ascending: false })
      .limit(1)
      .single()
      .then(res => res.data);
  }
  
  if (!targetEdition) {
     return { allEditions };
  }

  const editionId = targetEdition.id;

  // 3. Obter dados para a edição alvo
  const { data: peopleCounts } = await supabase
    .from("pessoas")
    .select("tipo", { count: "exact" })
    .eq("edicao_id", editionId);

  const participantCount = peopleCounts?.filter((p: any) => p.tipo === "participante").length ?? 0;
  const teamCount = peopleCounts?.filter((p: any) => p.tipo === "equipe").length ?? 0;

  const { data: payments } = await supabase
    .from("pagamentos")
    .select("valor")
    .eq("edicao_id", editionId);
  const totalCollected = payments?.reduce((sum, p) => sum + parseFloat(p.valor), 0) ?? 0;

  const { data: tribeDistribution } = await supabase
    .from("pessoas")
    .select("tribos(nome)")
    .eq("edicao_id", editionId)
    .not("tribo_id", "is", null);

  const tribeData = tribeDistribution?.reduce((acc: any, curr: any) => {
    const tribeName = curr.tribos.nome;
    acc[tribeName] = (acc[tribeName] || 0) + 1;
    return acc;
  }, {});
  const chartData = tribeData ? Object.keys(tribeData).map((name) => ({ name, total: tribeData[name] })) : [];

  const { data: recentSignups } = await supabase
    .from("pessoas")
    .select("id, nome_completo, tipo, created_at, avatar_url")
    .eq("edicao_id", editionId)
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    allEditions,
    currentEdition: targetEdition,
    stats: {
      participants: participantCount,
      team: teamCount,
      totalCollected,
    },
    chartData,
    recentSignups,
  };
}

export default async function DashboardHome({
  searchParams,
}: {
  searchParams?: { edition?: string };
}) {
  const selectedEditionId = searchParams?.edition;
  const data = await getDashboardData(selectedEditionId);

  if (data.allEditions.length === 0) {
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
  
  if (!data.currentEdition) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-2xl font-bold mb-2">Selecione uma edição</h1>
        <p className="text-muted-foreground mb-4">
          Use o seletor acima para carregar os dados de uma edição.
        </p>
         <EditionSelector editions={data.allEditions} currentEditionId={""} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">
          Painel - {data.currentEdition.nome_edicao}
        </h1>
        <EditionSelector editions={data.allEditions} currentEditionId={data.currentEdition.id} />
      </div>
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