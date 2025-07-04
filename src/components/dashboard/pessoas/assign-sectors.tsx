"use client";

import { useState, useEffect, useTransition } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateSectorsForPerson } from "@/app/dashboard/pessoas/[id]/actions";
import { toast } from "sonner";

interface Sector {
  id: string;
  nome: string;
}

interface AssignSectorsProps {
  personId: string;
  assignedSectors: Sector[];
}

export function AssignSectors({ personId, assignedSectors }: AssignSectorsProps) {
  const [allSectors, setAllSectors] = useState<Sector[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(() =>
    assignedSectors.map((s) => s.id)
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createSupabaseClient();
    const fetchSectors = async () => {
      const { data, error } = await supabase.from("setores").select("id, nome");
      if (data) setAllSectors(data);
    };
    fetchSectors();
  }, []);

  const handleCheckboxChange = (sectorId: string, checked: boolean) => {
    setSelectedSectors((prev) =>
      checked ? [...prev, sectorId] : prev.filter((id) => id !== sectorId)
    );
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await updateSectorsForPerson(personId, selectedSectors);
      if (result.success) {
        toast.success("Setores atualizados com sucesso!");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {allSectors.map((sector) => (
          <div key={sector.id} className="flex items-center space-x-2">
            <Checkbox
              id={`sector-${sector.id}`}
              checked={selectedSectors.includes(sector.id)}
              onCheckedChange={(checked) => handleCheckboxChange(sector.id, !!checked)}
            />
            <Label htmlFor={`sector-${sector.id}`}>{sector.nome}</Label>
          </div>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={isPending} className="w-full">
        {isPending ? "Salvando..." : "Salvar Setores"}
      </Button>
    </div>
  );
}