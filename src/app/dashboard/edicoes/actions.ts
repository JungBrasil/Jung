"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import * as z from "zod";
import { getUserRole } from "@/lib/auth";

const editionSchema = z.object({
  nome_edicao: z.string().min(3, "Nome da edição é obrigatório."),
  numero_edicao: z.coerce.number().min(1, "Número da edição é obrigatório."),
  local: z.string().min(3, "Local é obrigatório."),
  data_inicio: z.date({ required_error: "Data de início é obrigatória." }),
  data_fim: z.date({ required_error: "Data de fim é obrigatória." }),
  taxa_inscricao: z.coerce.number().min(0, "Taxa de inscrição deve ser positiva."),
});

export async function addEdition(values: z.infer<typeof editionSchema>) {
  const role = await getUserRole();
  if (role !== 'admin') {
    return { success: false, error: "Acesso negado." };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("edicoes").insert([
    {
      ...values,
      data_inicio: values.data_inicio.toISOString(),
      data_fim: values.data_fim.toISOString(),
    },
  ]);

  if (error) {
    return { success: false, error: "Falha ao criar edição." };
  }

  revalidatePath("/dashboard/edicoes");
  return { success: true, data };
}

export async function updateEdition(
  id: string,
  values: z.infer<typeof editionSchema>
) {
  const role = await getUserRole();
  if (role !== 'admin') {
    return { success: false, error: "Acesso negado." };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("edicoes")
    .update({
      ...values,
      data_inicio: values.data_inicio.toISOString(),
      data_fim: values.data_fim.toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: "Falha ao atualizar edição." };
  }

  revalidatePath("/dashboard/edicoes");
  revalidatePath(`/dashboard/edicoes/${id}`);
  return { success: true, data };
}

export async function deleteEdition(id: string) {
  const role = await getUserRole();
  if (role !== 'admin') {
    return { success: false, error: "Acesso negado." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("edicoes").delete().eq("id", id);

  if (error) {
    return { success: false, error: "Falha ao excluir edição." };
  }

  revalidatePath("/dashboard/edicoes");
  return { success: true };
}