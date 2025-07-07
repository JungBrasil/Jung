"use client";
import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AssignSectorsProps {
  personId: string;
  assignedSectors: { id: string; nome: string }[];
}

type Sector = {
  id: string;
  nome: string;
};

export function AssignSectors({ personId, assignedSectors }: AssignSectorsProps) {
  const [allSectors, setAllSectors] = useState<Sector[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(() =>
    assignedSectors.map((s) => s.id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchSectors() {
      const { data } = await supabase.from("setores").select("id, nome").order("nome");
      if (data) setAllSectors(data);
    }
    fetchSectors();
  }, [supabase]);

  const handleToggleSector = (sectorId: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorId)
        ? prev.filter((id) => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  async function handleUpdateSectors() {
    setIsLoading(true);
    
    // Delete existing relations
    const { error: deleteError } = await supabase.from("equipe_setores").delete().eq("pessoa_id", personId);
    if (deleteError) {
      toast.error("Erro ao atualizar setores.");
      setIsLoading(false);
      return;
    }

    // Insert new relations
    if (selectedSectors.length > 0) {
      const newRelations = selectedSectors.map(setor_id => ({ pessoa_id: personId, setor_id }));
      const { error: insertError } = await supabase.from("equipe_setores").insert(newRelations);
      if (insertError) {
        toast.error("Erro ao salvar novos setores.");
        setIsLoading(false);
        return;
      }
    }

    toast.success("Setores atualizados com sucesso!");
    setIsLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {allSectors.map((sector) => (
          <div key={sector.id} className="flex items-center space-x-2">
            <Checkbox
              id={`sector-${sector.id}`}
              checked={selectedSectors.includes(sector.id)}
              onCheckedChange={() => handleToggleSector(sector.id)}
            />
            <Label htmlFor={`sector-${sector.id}`}>{sector.nome}</Label>
          </div>
        ))}
      </div>
      <Button onClick={handleUpdateSectors} disabled={isLoading} className="w-full">
        {isLoading ? "Salvando..." : "Salvar Setores"}
      </Button>
    </div>
  );
}