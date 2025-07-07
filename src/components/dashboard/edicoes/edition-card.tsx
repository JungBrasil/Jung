"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { EditionFormDialog } from "./edition-form-dialog";

type Edicao = {
  id: string;
  nome_edicao: string;
  numero_edicao: number;
  local: string;
  data_inicio: string;
  data_fim: string;
  taxa_inscricao: number;
};

interface EditionCardProps {
  edicao: Edicao;
}

export function EditionCard({ edicao }: EditionCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{edicao.nome_edicao}</CardTitle>
        <CardDescription>Edição Nº {edicao.numero_edicao}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(edicao.data_inicio), "dd/MM/yy", { locale: ptBR })} - {format(new Date(edicao.data_fim), "dd/MM/yy", { locale: ptBR })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{edicao.local}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <EditionFormDialog mode="edit" initialData={edicao} />
        <Button asChild variant="secondary">
          <Link href={`/dashboard/edicoes/${edicao.id}`}>
            Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}