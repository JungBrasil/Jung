import { AddItemForm } from "@/components/dashboard/shared/add-item-form";
import { ItemsList } from "@/components/dashboard/shared/items-list";
import { addTribe, deleteTribe } from "./actions";

export default function TribosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tribos</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-2">Adicionar Nova Tribo</h2>
          <AddItemForm
            action={addTribe}
            itemName="Nome da Tribo"
            buttonText="Adicionar Tribo"
          />
        </div>
        <div className="md:col-span-2">
          <ItemsList
            deleteAction={deleteTribe}
            title="Tribos Cadastradas"
            notFoundMessage="Nenhuma tribo cadastrada."
            tableName="tribos"
          />
        </div>
      </div>
    </div>
  );
}