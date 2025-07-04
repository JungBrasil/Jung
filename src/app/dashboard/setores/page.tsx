import { AddItemForm } from "@/components/dashboard/shared/add-item-form";
import { ItemsList } from "@/components/dashboard/shared/items-list";
import { addSector, deleteSector } from "./actions";

export default function SetoresPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Setores de Trabalho</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-2">Adicionar Novo Setor</h2>
          <AddItemForm
            action={addSector}
            itemName="Nome do Setor"
            buttonText="Adicionar Setor"
          />
        </div>
        <div className="md:col-span-2">
          <ItemsList
            fetcher={() =>
              addSector({ name: "" }).then(() =>
                // This is a trick to get the list after an add
                fetch("http://localhost:3000/api/setores").then((res) =>
                  res.json()
                )
              )
            }
            deleteAction={deleteSector}
            title="Setores Cadastrados"
            notFoundMessage="Nenhum setor cadastrado."
            tableName="setores"
          />
        </div>
      </div>
    </div>
  );
}