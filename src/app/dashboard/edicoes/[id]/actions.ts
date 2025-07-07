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
  altura_cm: z.coerce.number().optional(),
  peso_kg: z.coerce.number().optional(),
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
      data_nascimento: values.data_nascimento.toISOString().split('T')[0],
    },
  ]);

  if (error) {
    console.error("Supabase error:", error.message);
    return { success: false, error: "Falha ao adicionar registro." };
  }

  revalidatePath(`/dashboard/edicoes/${editionId}`);
  return { success: true, data };
}

export async function updatePessoa(
  personId: string,
  values: z.infer<typeof pessoaSchema>
) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("pessoas")
    .update({
      ...values,
      data_nascimento: values.data_nascimento.toISOString().split('T')[0],
    })
    .eq("id", personId);

  if (error) {
    console.error("Supabase error:", error.message);
    return { success: false, error: "Falha ao atualizar registro." };
  }

  revalidatePath(`/dashboard/pessoas/${personId}`);
  revalidatePath(`/dashboard/edicoes`); // Revalidate list pages
  return { success: true, data };
}

export async function getParticipantsForReport(editionId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pessoas")
    .select("nome_completo, telefone, tribos(nome)")
    .eq("edicao_id", editionId)
    .eq("tipo", "participante")
    .order("nome_completo", { ascending: true });

  if (error) {
    console.error("Report data error:", error);
    return { error: "Falha ao buscar dados para o relatório." };
  }

  return { data };
}

export async function getPeopleForCsvExport(editionId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pessoas")
    .select(`
      nome_completo,
      tipo,
      data_nascimento,
      telefone,
      email,
      endereco_rua,
      endereco_numero,
      endereco_complemento,
      endereco_bairro,
      endereco_cidade,
      endereco_estado,
      endereco_cep,
      altura_cm,
      peso_kg,
      tamanho_camiseta,
      toma_medicamento_continuo,
      medicamentos_continuos,
      possui_alergias,
      alergias,
      e_servo,
      paroquia,
      comunidade,
      observacoes,
      tribos(nome),
      pagamentos(valor)
    `)
    .eq("edicao_id", editionId)
    .order("nome_completo", { ascending: true });

  if (error) {
    console.error("CSV Export error:", error);
    return { error: "Falha ao buscar dados para exportação." };
  }

  // Processar os dados para um formato plano
  const flatData = data.map(p => ({
    ...p,
    tribo: p.tribos?.nome || '',
    total_pago: p.pagamentos.reduce((sum, pay) => sum + parseFloat(pay.valor), 0),
    pagamentos: undefined, // remover dados aninhados
    tribos: undefined,
  }));

  return { data: flatData };
}