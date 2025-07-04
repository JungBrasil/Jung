"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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