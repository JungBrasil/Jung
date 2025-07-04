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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type PessoaTipo = "participante" | "equipe";

export async function PessoasList({
  editionId,
  tipo,
  searchQuery,
}: {
  editionId: string;
  tipo: PessoaTipo;
  searchQuery?: string;
}) {
  const supabase = createSupabaseServerClient();
  
  let query = supabase
    .from("pessoas")
    .select("*, tribos(nome)")
    .eq("edicao_id", editionId)
    .eq("tipo", tipo)
    .order("nome_completo", { ascending: true });

  if (searchQuery) {
    query = query.ilike("nome_completo", `%${searchQuery}%`);
  }

  const { data: pessoas, error } = await query;

  if (error) {
    return <p className="text-red-500">Erro ao carregar dados.</p>;
  }

  const tipoLabel = tipo === "participante" ? "participante" : "membro da equipe";

  if (!pessoas || pessoas.length === 0) {
    return (
      <div className="text-center text-muted-foreground border rounded-lg p-8">
        <p>Nenhum {tipoLabel} encontrado{searchQuery ? ` para a busca "${searchQuery}"` : ""}.</p>
        {!searchQuery && <p>Clique em "Adicionar {tipo === 'participante' ? 'Participante' : 'Membro'}" para começar.</p>}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome Completo</TableHead>
            <TableHead>Tribo</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pessoas.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.nome_completo}</TableCell>
              <TableCell>
                {p.tribos ? (
                  <Badge variant="secondary">{p.tribos.nome}</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>{p.telefone}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/pessoas/${p.id}`}>
                    Detalhes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}