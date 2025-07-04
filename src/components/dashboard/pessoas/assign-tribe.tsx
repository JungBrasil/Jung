"use client";

import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTribeForPerson } from "@/app/dashboard/pessoas/[id]/actions";
import { toast } from "sonner";

interface Tribe {
  id: string;
  nome: string;
}

interface AssignTribeProps {
  personId: string;
  currentTribeId: string | null;
}

export function AssignTribe({ personId, currentTribeId }: AssignTribeProps) {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [selectedTribe, setSelectedTribe] = useState(currentTribeId || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseClient();
    const fetchTribes = async () => {
      const { data, error } = await supabase.from("tribos").select("id, nome");
      if (data) setTribes(data);
    };
    fetchTribes();
  }, []);

  const handleTribeChange = async (tribeId: string) => {
    setIsLoading(true);
    setSelectedTribe(tribeId);
    const result = await updateTribeForPerson(personId, tribeId);
    if (result.success) {
      toast.success("Tribo atualizada com sucesso!");
    } else {
      toast.error(result.error);
      setSelectedTribe(currentTribeId || ""); // Revert on error
    }
    setIsLoading(false);
  };

  return (
    <Select
      onValueChange={handleTribeChange}
      value={selectedTribe}
      disabled={isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione uma tribo..." />
      </SelectTrigger>
      <SelectContent>
        {tribes.map((tribe) => (
          <SelectItem key={tribe.id} value={tribe.id}>
            {tribe.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}