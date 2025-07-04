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

export async function ParticipantsList({ editionId }: { editionId: string }) {
  const supabase = createSupabaseServerClient();
  const { data: participantes, error } = await supabase
    .from("participantes")
    .select("*")
    .eq("edicao_id", editionId)
    .order("nome_completo", { ascending: true });

  if (error) {
    return <p className="text-red-500">Erro ao carregar participantes.</p>;
  }

  if (!participantes || participantes.length === 0) {
    return (
      <div className="text-center text-muted-foreground border rounded-lg p-8">
        <p>Nenhum participante cadastrado para esta edição ainda.</p>
        <p>Clique em "Adicionar Participante" para começar.</p>
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
          {participantes.map((p) => (
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