"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Person = {
  nome_completo: string;
  tipo: string;
  avatar_url: string | null;
  data_nascimento: string;
  telefone: string | null;
  email: string | null;
  endereco_rua: string | null;
  endereco_numero: string | null;
  endereco_bairro: string | null;
  endereco_cidade: string | null;
  endereco_estado: string | null;
  endereco_cep: string | null;
  altura_cm: number | null;
  peso_kg: number | null;
  tamanho_camiseta: string | null;
  toma_medicamento_continuo: boolean;
  medicamentos_continuos: string | null;
  possui_alergias: boolean;
  alergias: string | null;
  paroquia: string | null;
  comunidade: string | null;
  e_servo: boolean;
  observacoes: string | null;
  edicoes: { nome_edicao: string } | null;
  tribos: { nome: string } | null;
};

interface PessoaFichaImpressaoProps {
  person: Person;
}

const FichaItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="py-2">
    <p className="text-sm font-semibold text-gray-600">{label}</p>
    <p className="text-base text-black">{value || "Não informado"}</p>
  </div>
);

export function PessoaFichaImpressao({ person }: PessoaFichaImpressaoProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
  };

  const formatAddress = (p: Person) => {
    const parts = [
      p.endereco_rua,
      p.endereco_numero,
      p.endereco_bairro,
      p.endereco_cidade,
      p.endereco_estado,
      p.endereco_cep,
    ].filter(Boolean);
    return parts.join(", ") || "Não informado";
  };

  return (
    <div className="hidden print:block p-8 font-sans bg-white">
      <header className="flex items-center justify-between pb-4 border-b-2 border-black">
        <div>
          <h1 className="text-3xl font-bold text-black">Ficha de Inscrição</h1>
          <p className="text-lg text-gray-700">{person.edicoes?.nome_edicao}</p>
        </div>
        <Avatar className="h-24 w-24 border-2 border-gray-300">
          <AvatarImage src={person.avatar_url || undefined} alt={person.nome_completo} />
          <AvatarFallback className="text-3xl">
            {getInitials(person.nome_completo)}
          </AvatarFallback>
        </Avatar>
      </header>

      <section className="mt-6">
        <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">Dados Pessoais</h2>
        <div className="grid grid-cols-3 gap-x-8 gap-y-2">
          <FichaItem label="Nome Completo" value={person.nome_completo} />
          <FichaItem label="Data de Nascimento" value={format(new Date(person.data_nascimento), "dd/MM/yyyy", { locale: ptBR })} />
          <FichaItem label="Tipo" value={person.tipo === 'participante' ? 'Participante' : 'Equipe'} />
          <FichaItem label="Telefone" value={person.telefone} />
          <FichaItem label="Email" value={person.email} />
          <FichaItem label="Endereço" value={formatAddress(person)} />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">Dados Físicos e de Saúde</h2>
        <div className="grid grid-cols-3 gap-x-8 gap-y-2">
          <FichaItem label="Altura" value={person.altura_cm ? `${person.altura_cm} cm` : null} />
          <FichaItem label="Peso" value={person.peso_kg ? `${person.peso_kg} kg` : null} />
          <FichaItem label="Tamanho da Camiseta" value={person.tamanho_camiseta} />
        </div>
        <div className="mt-4">
          <FichaItem label="Toma Medicamento Contínuo?" value={person.toma_medicamento_continuo ? `Sim: ${person.medicamentos_continuos}` : "Não"} />
          <FichaItem label="Possui Alergias?" value={person.possui_alergias ? `Sim: ${person.alergias}` : "Não"} />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">Informações Adicionais</h2>
        <div className="grid grid-cols-3 gap-x-8 gap-y-2">
          <FichaItem label="Paróquia/Comunidade" value={`${person.paroquia || ''} / ${person.comunidade || ''}`} />
          <FichaItem label="É servo do Enchei-vos?" value={person.e_servo ? "Sim" : "Não"} />
          <FichaItem label="Tribo" value={person.tribos?.nome} />
        </div>
         <div className="mt-4">
          <FichaItem label="Observações" value={person.observacoes} />
        </div>
      </section>

      <footer className="mt-12 pt-4 border-t-2 border-black text-center">
        <p className="text-sm text-gray-600">Documento gerado pelo Sistema de Gestão HdH Acampamento.</p>
      </footer>
    </div>
  );
}