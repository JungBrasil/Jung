"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Edition {
  id: string;
  nome_edicao: string;
}

interface EditionSelectorProps {
  editions: Edition[];
  currentEditionId: string;
}

export function EditionSelector({
  editions,
  currentEditionId,
}: EditionSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (editionId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("edition", editionId);
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={handleValueChange} defaultValue={currentEditionId}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma edição" />
        </SelectTrigger>
        <SelectContent>
          {editions.map((edition) => (
            <SelectItem key={edition.id} value={edition.id}>
              {edition.nome_edicao}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}