import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PessoaFormSheet } from "@/components/dashboard/pessoas/pessoa-form-sheet";
import { PessoasList } from "@/components/dashboard/pessoas/pessoas-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditionFormDialog } from "@/components/dashboard/edicoes/edition-form-dialog";
import { GenerateReportButton } from "@/components/dashboard/edicoes/generate-report-button";
import { SearchInput } from "@/components/dashboard/shared/search-input";
import { ExportCsvButton } from "@/components/dashboard/edicoes/export-csv-button";
import { getUserWithProfile } from "@/lib/supabase/user";

export default async function EditionDetailsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { q?: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: edicao, error } = await supabase
    .from("edicoes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !edicao) {
    notFound();
  }

  const { profile } = await getUserWithProfile();
  const isAdmin = profile?.role === 'admin';
  const isEditor = profile?.role === 'editor';
  const canEdit = isAdmin || isEditor;

  const searchQuery = searchParams?.q || "";

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle className="text-3xl">{edicao.nome_edicao}</CardTitle>
            <CardDescription>Edição Nº {edicao.numero_edicao}</CardDescription>
          </div>
          {isAdmin && <EditionFormDialog mode="edit" initialData={edicao} />}
        </CardHeader>
        <CardContent className="flex gap-4">
          <Badge variant="secondary">{edicao.local}</Badge>
          <Badge variant="outline">
            {format(new Date(edicao.data_inicio), "dd/MM/yyyy")} a{" "}
            {format(new Date(edicao.data_fim), "dd/MM/yyyy")}
          </Badge>
           <Badge variant="default">
            Inscrição: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(edicao.taxa_inscricao || 0)}
          </Badge>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <SearchInput placeholder="Buscar por nome..." />
        <div className="flex gap-2">
          <GenerateReportButton editionId={edicao.id} editionName={edicao.nome_edicao} />
          <ExportCsvButton editionId={edicao.id} editionName={edicao.nome_edicao} />
        </div>
      </div>

      <Tabs defaultValue="participantes">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="participantes">Participantes</TabsTrigger>
          <TabsTrigger value="equipe">Equipe de Trabalho</TabsTrigger>
        </TabsList>
        <TabsContent value="participantes">
          <div className="flex items-center justify-between my-6">
            <h2 className="text-2xl font-bold">Lista de Participantes</h2>
            {canEdit && <PessoaFormSheet editionId={edicao.id} tipo="participante" mode="add" />}
          </div>
          <Suspense fallback={<Skeleton className="w-full h-64" />}>
            <PessoasList editionId={edicao.id} tipo="participante" searchQuery={searchQuery} />
          </Suspense>
        </TabsContent>
        <TabsContent value="equipe">
          <div className="flex items-center justify-between my-6">
            <h2 className="text-2xl font-bold">Lista da Equipe</h2>
            {canEdit && <PessoaFormSheet editionId={edicao.id} tipo="equipe" mode="add" />}
          </div>
          <Suspense fallback={<Skeleton className="w-full h-64" />}>
            <PessoasList editionId={edicao.id} tipo="equipe" searchQuery={searchQuery} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}