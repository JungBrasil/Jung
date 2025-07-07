"use client";
import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Person = {
  id: string;
  pagamentos: { id: string; valor: number; data_pagamento: string }[];
  edicoes: { taxa_inscricao: number } | null;
};

interface FinancialStatusProps {
  person: Person;
}

export function FinancialStatus({ person }: FinancialStatusProps) {
  const totalPaid = person.pagamentos.reduce((sum, p) => sum + p.valor, 0);
  const registrationFee = person.edicoes?.taxa_inscricao || 0;
  const dueAmount = registrationFee - totalPaid;
  const progress = registrationFee > 0 ? (totalPaid / registrationFee) * 100 : 100;

  const [paymentValue, setPaymentValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseClient();

  async function handleAddPayment() {
    const value = parseFloat(paymentValue);
    if (isNaN(value) || value <= 0) {
      toast.error("Valor de pagamento inválido.");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.from("pagamentos").insert({
      pessoa_id: person.id,
      valor: value,
      data_pagamento: new Date().toISOString(),
    });

    if (error) {
      toast.error("Falha ao registrar pagamento.");
    } else {
      toast.success("Pagamento registrado com sucesso!");
      setPaymentValue("");
      // Note: This will require a page refresh to see the updated status.
      // For real-time update, state management or re-fetching is needed.
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Pago: R$ {totalPaid.toFixed(2)}</span>
          <span className="font-semibold">Total: R$ {registrationFee.toFixed(2)}</span>
        </div>
        <Progress value={progress} />
        <div className="text-right text-sm mt-1">
          {dueAmount > 0 ? (
            <Badge variant="destructive">Faltam R$ {dueAmount.toFixed(2)}</Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-200 text-green-800">Pago</Badge>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Valor do pagamento"
          value={paymentValue}
          onChange={(e) => setPaymentValue(e.target.value)}
        />
        <Button onClick={handleAddPayment} disabled={isLoading} className="w-full">
          {isLoading ? "Registrando..." : "Adicionar Pagamento"}
        </Button>
      </div>
    </div>
  );
}