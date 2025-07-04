"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddPaymentDialog } from "./add-payment-dialog";
import { DeletePaymentButton } from "./delete-payment-button";
import { format } from "date-fns";

// Tipagem para os dados da pessoa, incluindo pagamentos e edição
type PersonWithDetails = {
  id: string;
  edicao_id: string;
  edicoes: {
    taxa_inscricao: number | null;
  } | null;
  pagamentos: {
    id: string;
    valor: string;
    data_pagamento: string;
    metodo_pagamento: string | null;
  }[];
};

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function FinancialStatus({ person }: { person: PersonWithDetails }) {
  const registrationFee = person.edicoes?.taxa_inscricao ?? 0;
  const payments = person.pagamentos || [];

  const totalPaid = useMemo(() => {
    return payments.reduce((sum, p) => sum + parseFloat(p.valor), 0);
  }, [payments]);

  const balance = registrationFee - totalPaid;

  const getStatus = () => {
    if (registrationFee === 0) return <Badge variant="secondary">Isento</Badge>;
    if (balance <= 0) return <Badge className="bg-green-500 text-white">Pago</Badge>;
    if (totalPaid > 0) return <Badge variant="destructive">Parcial</Badge>;
    return <Badge variant="destructive">Pendente</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
        <span className="font-medium">Status</span>
        {getStatus()}
      </div>
      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <span>Taxa de Inscrição:</span>
          <span className="font-semibold">{formatCurrency(registrationFee)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Pago:</span>
          <span className="font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 mt-2">
          <span className="font-bold">Saldo Devedor:</span>
          <span className="font-bold text-red-600">{formatCurrency(balance > 0 ? balance : 0)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Histórico de Pagamentos</h4>
          <AddPaymentDialog personId={person.id} editionId={person.edicao_id} />
        </div>
        {payments.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{formatCurrency(parseFloat(p.valor))}</TableCell>
                    <TableCell>{format(new Date(p.data_pagamento), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DeletePaymentButton paymentId={p.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">
            Nenhum pagamento registrado.
          </p>
        )}
      </div>
    </div>
  );
}