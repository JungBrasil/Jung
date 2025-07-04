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
import { AddParticipantSheet } from "@/components/dashboard/participantes/add-participant-sheet";
import { ParticipantsList } from "@/components/dashboard/participantes/participants-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Participantes</h2>
        <AddParticipantSheet editionId={edicao.id} />
      </div>

      <Suspense fallback={<Skeleton className="w-full h-64" />}>
        <ParticipantsList editionId={edicao.id} />
      </Suspense>
    </div>
  );
}