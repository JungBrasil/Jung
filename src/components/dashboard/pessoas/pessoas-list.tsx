import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type PessoaTipo = "participante" | "equipe";

export async function PessoasList({
  editionId,
  tipo,
}: {
  editionId: string;
  tipo: PessoaTipo;
}) {
  const supabase = createSupabaseServerClient();
  const { data: pessoas, error } = await supabase
    .from("pessoas")
    .select("*")
    .eq("edicao_id", editionId)
    .eq("tipo", tipo)
    .order("nome_completo", { ascending: true });

  if (error) {
    return <p className="text-red-500">Erro ao carregar dados.</p>;
  }

  const tipoLabel = tipo === "participante" ? "participante" : "membro da equipe";

  if (!pessoas || pessoas.length === 0) {
    return (
      <div className="text-center text-muted-foreground border rounded-lg p-8">
        <p>Nenhum {tipoLabel} cadastrado para esta edição ainda.</p>
        <p>Clique em "Adicionar {tipo === 'participante' ? 'Participante' : 'Membro'}" para começar.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome Completo</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Camiseta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pessoas.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.nome_completo}</TableCell>
              <TableCell>{p.telefone}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{p.tamanho_camiseta}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}