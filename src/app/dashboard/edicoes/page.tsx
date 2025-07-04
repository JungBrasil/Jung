import { EditionsList } from "@/components/dashboard/edicoes/editions-list";
import { AddEditionDialog } from "@/components/dashboard/edicoes/add-edition-dialog";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EdicoesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edições do Acampamento</h1>
        <AddEditionDialog />
      </div>
      <Suspense fallback={<Skeleton className="w-full h-32" />}>
        <EditionsList />
      </Suspense>
    </div>
  );
}