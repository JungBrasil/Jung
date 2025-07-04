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
import { AddPessoaSheet } from "@/components/dashboard/pessoas/add-pessoa-sheet";
import { PessoasList } from "@/components/dashboard/pessoas/pessoas-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function EditionDetailsPage({
  params,
}: {
  params: { id: string };
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

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl">{edicao.nome_edicao}</CardTitle>
          <CardDescription>Edição Nº {edicao.numero_edicao}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Badge variant="secondary">{edicao.local}</Badge>
          <Badge variant="outline">
            {format(new Date(edicao.data_inicio), "dd/MM/yyyy")} a{" "}
            {format(new Date(edicao.data_fim), "dd/MM/yyyy")}
          </Badge>
        </CardContent>
      </Card>

      <Tabs defaultValue="participantes">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="participantes">Participantes</TabsTrigger>
          <TabsTrigger value="equipe">Equipe de Trabalho</TabsTrigger>
        </TabsList>
        <TabsContent value="participantes">
          <div className="flex items-center justify-between my-6">
            <h2 className="text-2xl font-bold">Lista de Participantes</h2>
            <AddPessoaSheet editionId={edicao.id} tipo="participante" />
          </div>
          <Suspense fallback={<Skeleton className="w-full h-64" />}>
            <PessoasList editionId={edicao.id} tipo="participante" />
          </Suspense>
        </TabsContent>
        <TabsContent value="equipe">
          <div className="flex items-center justify-between my-6">
            <h2 className="text-2xl font-bold">Lista da Equipe</h2>
            <AddPessoaSheet editionId={edicao.id} tipo="equipe" />
          </div>
          <Suspense fallback={<Skeleton className="w-full h-64" />}>
            <PessoasList editionId={edicao.id} tipo="equipe" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}