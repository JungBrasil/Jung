"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import * as z from "zod";

export async function updateAvatarUrl(personId: string, avatarUrl: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("pessoas")
    .update({ avatar_url: avatarUrl })
    .eq("id", personId);

  if (error) {
    console.error("Update avatar error:", error);
    return { success: false, error: "Falha ao atualizar foto do perfil." };
  }

  revalidatePath(`/dashboard/pessoas/${personId}`);
  revalidatePath(`/dashboard`);
  return { success: true };
}


export async function updateTribeForPerson(personId: string, tribeId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("pessoas")
    .update({ tribo_id: tribeId })
    .eq("id", personId);

  if (error) {
    return { success: false, error: "Falha ao atualizar tribo." };
  }

  revalidatePath(`/dashboard/pessoas/${personId}`);
  revalidatePath(`/dashboard/edicoes/`); // Revalidate list page to show updated tribe
  return { success: true };
}

export async function updateSectorsForPerson(personId: string, sectorIds: string[]) {
  const supabase = createSupabaseServerClient();

  // 1. Delete existing sector assignments for this person
  const { error: deleteError } = await supabase
    .from("equipe_setores")
    .delete()
    .eq("pessoa_id", personId);

  if (deleteError) {
    return { success: false, error: "Falha ao limpar setores antigos." };
  }

  // 2. Insert new assignments if any are selected
  if (sectorIds.length > 0) {
    const newAssignments = sectorIds.map((setor_id) => ({
      pessoa_id: personId,
      setor_id,
    }));

    const { error: insertError } = await supabase
      .from("equipe_setores")
      .insert(newAssignments);

    if (insertError) {
      return { success: false, error: "Falha ao atribuir novos setores." };
    }
  }

  revalidatePath(`/dashboard/pessoas/${personId}`);
  return { success: true };
}

const paymentSchema = z.object({
  valor: z.number(),
  data_pagamento: z.date(),
  metodo_pagamento: z.string(),
  personId: z.string().uuid(),
  editionId: z.string().uuid(),
});

export async function addPayment(values: z.infer<typeof paymentSchema>) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from("pagamentos").insert({
    pessoa_id: values.personId,
    edicao_id: values.editionId,
    valor: values.valor,
    data_pagamento: values.data_pagamento.toISOString().split('T')[0],
    metodo_pagamento: values.metodo_pagamento,
  });

  if (error) {
    console.error("Payment error:", error);
    return { success: false, error: "Falha ao registrar pagamento." };
  }

  revalidatePath(`/dashboard/pessoas/${values.personId}`);
  return { success: true };
}

export async function deletePayment(paymentId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("pagamentos")
    .delete()
    .eq("id", paymentId);

  if (error) {
    console.error("Delete payment error:", error);
    return { success: false, error: "Falha ao remover pagamento." };
  }

  // Revalidar o path de pessoas para atualizar a lista em qualquer página de detalhes
  revalidatePath("/dashboard/pessoas", "layout");
  return { success: true };
}