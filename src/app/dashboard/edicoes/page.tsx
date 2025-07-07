import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EditionCard } from "@/components/dashboard/edicoes/edition-card";
import { EditionFormDialog } from "@/components/dashboard/edicoes/edition-form-dialog";

export default async function EdicoesPage() {
  const supabase = createSupabaseServerClient();
  const { data: edicoes, error } = await supabase
    .from("edicoes")
    .select("*")
    .order("numero_edicao", { ascending: false });

  if (error) {
    return <p>Erro ao carregar edições.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edições do Acampamento</h1>
        <EditionFormDialog mode="add" />
      </div>
      {edicoes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {edicoes.map((edicao) => (
            <EditionCard key={edicao.id} edicao={edicao} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">Nenhuma edição encontrada</h2>
          <p className="text-muted-foreground mt-2">
            Crie a primeira edição para começar a gerenciar.
          </p>
        </div>
      )}
    </div>
  );
}