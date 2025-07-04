import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemDialog } from "./edit-item-dialog";

interface ItemsListProps {
  deleteAction: (id: string) => Promise<{ success?: string; error?: string }>;
  updateAction: (id: string, values: { name: string }) => Promise<{ success?: string; error?: string }>;
  title: string;
  notFoundMessage: string;
  tableName: "setores" | "tribos";
  itemName: string;
}

export async function ItemsList({
  deleteAction,
  updateAction,
  title,
  notFoundMessage,
  tableName,
  itemName,
}: ItemsListProps) {
  const supabase = createSupabaseServerClient();
  const { data: items, error } = await supabase
    .from(tableName)
    .select("id, nome")
    .order("nome", { ascending: true });

  if (error) {
    return <p className="text-red-500">Erro ao carregar dados.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{notFoundMessage}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell className="text-right">
                    <EditItemDialog item={item} action={updateAction} itemName={itemName} />
                    <DeleteItemButton id={item.id} action={deleteAction} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}