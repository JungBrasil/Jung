"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import * as z from "zod";

const formSchema = z.object({
  numero_edicao: z.number(),
  nome_edicao: z.string(),
  local: z.string().optional(),
  data_inicio: z.date(),
  data_fim: z.date(),
});

export async function addEdition(values: z.infer<typeof formSchema>) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.from("edicoes").insert([
    {
      numero_edicao: values.numero_edicao,
      nome_edicao: values.nome_edicao,
      local: values.local,
      data_inicio: values.data_inicio.toISOString(),
      data_fim: values.data_fim.toISOString(),
    },
  ]);

  if (error) {
    console.error("Supabase error:", error.message);
    return { success: false, error: "Falha ao adicionar edição." };
  }

  revalidatePath("/dashboard/edicoes");
  return { success: true, data };
}