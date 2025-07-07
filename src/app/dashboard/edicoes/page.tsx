import { EditionsList } from "@/components/dashboard/edicoes/editions-list";
import { EditionFormDialog } from "@/components/dashboard/edicoes/edition-form-dialog";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserWithProfile } from "@/lib/supabase/user";

export default async function EdicoesPage() {
  const { profile } = await getUserWithProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edições do Acampamento</h1>
        {isAdmin && <EditionFormDialog mode="add" />}
      </div>
      <Suspense fallback={<Skeleton className="w-full h-32" />}>
        <EditionsList />
      </Suspense>
    </div>
  );
}