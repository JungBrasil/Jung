import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export async function EditionsList() {
  const supabase = createSupabaseServerClient();
  const { data: edicoes, error } = await supabase
    .from("edicoes")
    .select("*")
    .order("numero_edicao", { ascending: false });

  if (error) {
    return <p className="text-red-500">Erro ao carregar edições.</p>;
  }

  if (!edicoes || edicoes.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        <p>Nenhuma edição cadastrada ainda.</p>
        <p>Clique em "Adicionar Edição" para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {edicoes.map((edicao) => (
        <Card key={edicao.id}>
          <CardHeader>
            <CardTitle>{edicao.nome_edicao}</CardTitle>
            <CardDescription>Edição Nº {edicao.numero_edicao}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{edicao.local}</p>
          </CardContent>
          <CardFooter>
            <Badge variant="outline">
              {format(new Date(edicao.data_inicio), "dd/MM/yyyy")} -{" "}
              {format(new Date(edicao.data_fim), "dd/MM/yyyy")}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}