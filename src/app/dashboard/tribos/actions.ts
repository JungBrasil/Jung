"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const itemSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
});

export async function addTribe(values: { name: string }) {
  const validatedFields = itemSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Nome inválido." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("tribos")
    .insert([{ nome: validatedFields.data.name }]);

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      return { error: "Esta tribo já existe." };
    }
    return { error: "Falha ao adicionar tribo." };
  }

  revalidatePath("/dashboard/tribos");
  return { success: "Tribo adicionada com sucesso!" };
}

export async function updateTribe(id: string, values: { name: string }) {
  const validatedFields = itemSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Nome inválido." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("tribos")
    .update({ nome: validatedFields.data.name })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Esta tribo já existe." };
    }
    return { error: "Falha ao atualizar tribo." };
  }

  revalidatePath("/dashboard/tribos");
  return { success: "Tribo atualizada com sucesso!" };
}

export async function deleteTribe(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("tribos").delete().eq("id", id);

  if (error) {
    return { error: "Falha ao remover tribo." };
  }

  revalidatePath("/dashboard/tribos");
  return { success: "Tribo removida com sucesso!" };
}