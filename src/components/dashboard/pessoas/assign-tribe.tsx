"use client";
import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AssignTribeProps {
  personId: string;
  currentTribeId: string | null;
}

type Tribe = {
  id: string;
  nome: string;
};

export function AssignTribe({ personId, currentTribeId }: AssignTribeProps) {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [selectedTribe, setSelectedTribe] = useState<string | null>(currentTribeId);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchTribes() {
      const { data, error } = await supabase.from("tribos").select("id, nome").order("nome");
      if (data) setTribes(data);
    }
    fetchTribes();
  }, [supabase]);

  async function handleAssignTribe() {
    setIsLoading(true);
    const { error } = await supabase
      .from("pessoas")
      .update({ tribo_id: selectedTribe })
      .eq("id", personId);

    if (error) {
      toast.error("Falha ao designar tribo.");
    } else {
      toast.success("Tribo designada com sucesso!");
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-3">
      <Select onValueChange={setSelectedTribe} defaultValue={selectedTribe || undefined}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma tribo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="null">Nenhuma</SelectItem>
          {tribes.map((tribe) => (
            <SelectItem key={tribe.id} value={tribe.id}>
              {tribe.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleAssignTribe} disabled={isLoading} className="w-full">
        {isLoading ? "Salvando..." : "Salvar Tribo"}
      </Button>
    </div>
  );
}