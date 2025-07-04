"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import * as z from "zod";

const pessoaSchema = z.object({
  nome_completo: z.string().min(3),
  data_nascimento: z.date(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  endereco_rua: z.string().optional(),
  endereco_numero: z.string().optional(),
  endereco_complemento: z.string().optional(),
  endereco_bairro: z.string().optional(),
  endereco_cidade: z.string().optional(),
  endereco_estado: z.string().optional(),
  endereco_cep: z.string().optional(),
  altura_cm: z.number().optional(),
  peso_kg: z.number().optional(),
  tamanho_camiseta: z.string().optional(),
  toma_medicamento_continuo: z.boolean().default(false),
  medicamentos_continuos: z.string().optional(),
  possui_alergias: z.boolean().default(false),
  alergias: z.string().optional(),
  e_servo: z.boolean().default(false),
  paroquia: z.string().optional(),
  comunidade: z.string().optional(),
  observacoes: z.string().optional(),
});

export async function addPessoa(
  editionId: string,
  tipo: "participante" | "equipe",
  values: z.infer<typeof pessoaSchema>
) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.from("pessoas").insert([
    {
      edicao_id: editionId,
      tipo: tipo,
      ...values,
      data_nascimento: values.data_nascimento.toISOString().split('T')[0], // Format as YYYY-MM-DD
    },
  ]);

  if (error) {
    console.error("Supabase error:", error.message);
    return { success: false, error: "Falha ao adicionar registro." };
  }

  revalidatePath(`/dashboard/edicoes/${editionId}`);
  return { success: true, data };
}