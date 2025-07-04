"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const itemSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
});

export async function addSector(values: { name: string }) {
  const validatedFields = itemSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Nome inválido." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("setores")
    .insert([{ nome: validatedFields.data.name }]);

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      return { error: "Este setor já existe." };
    }
    return { error: "Falha ao adicionar setor." };
  }

  revalidatePath("/dashboard/setores");
  return { success: "Setor adicionado com sucesso!" };
}

export async function deleteSector(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("setores").delete().eq("id", id);

  if (error) {
    return { error: "Falha ao remover setor." };
  }

  revalidatePath("/dashboard/setores");
  return { success: "Setor removido com sucesso!" };
}