"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getPeopleForCsvExport } from "@/app/dashboard/edicoes/[id]/actions";
import { unparse } from "papaparse";

interface ExportCsvButtonProps {
  editionId: string;
  editionName: string;
}

export function ExportCsvButton({
  editionId,
  editionName,
}: ExportCsvButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    toast.info("Preparando dados para exportação...");

    const result = await getPeopleForCsvExport(editionId);

    if (result.error || !result.data) {
      toast.error(result.error || "Não foi possível exportar os dados.");
      setIsLoading(false);
      return;
    }

    if (result.data.length === 0) {
      toast.warning("Não há dados para exportar nesta edição.");
      setIsLoading(false);
      return;
    }

    const csv = unparse(result.data, {
      header: true,
      quotes: true,
      delimiter: ",",
      newline: "\r\n",
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const safeFileName = editionName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute("download", `export_${safeFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Exportação concluída com sucesso!");
    setIsLoading(false);
  };

  return (
    <Button onClick={handleExport} disabled={isLoading} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      {isLoading ? "Exportando..." : "Exportar para CSV"}
    </Button>
  );
}