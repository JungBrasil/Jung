"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { getParticipantsForReport } from "@/app/dashboard/edicoes/[id]/actions";

interface GenerateReportButtonProps {
  editionId: string;
  editionName: string;
}

export function GenerateReportButton({
  editionId,
  editionName,
}: GenerateReportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    toast.info("Gerando relatório, por favor aguarde...");

    const result = await getParticipantsForReport(editionId);

    if (result.error || !result.data) {
      toast.error(result.error || "Não foi possível gerar o relatório.");
      setIsLoading(false);
      return;
    }

    const doc = new jsPDF();
    const participants = result.data;

    // Título
    doc.setFontSize(18);
    doc.text(`Relatório de Participantes - ${editionName}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 30);

    // Tabela
    autoTable(doc, {
      startY: 35,
      head: [["Nome Completo", "Telefone", "Tribo"]],
      body: participants.map((p) => [
        p.nome_completo,
        p.telefone || "N/A",
        p.tribos?.nome || "Sem tribo",
      ]),
      theme: "striped",
      headStyles: { fillColor: [22, 163, 74] }, // Cor verde
    });

    doc.save(`relatorio_participantes_${editionName.replace(/\s+/g, '_')}.pdf`);
    toast.success("Relatório gerado com sucesso!");
    setIsLoading(false);
  };

  return (
    <Button onClick={handleGenerateReport} disabled={isLoading}>
      <FileDown className="mr-2 h-4 w-4" />
      {isLoading ? "Gerando..." : "Gerar Relatório de Participantes"}
    </Button>
  );
}