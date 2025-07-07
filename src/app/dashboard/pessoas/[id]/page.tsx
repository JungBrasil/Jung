import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Cake,
  Phone,
  Mail,
  MapPin,
  Ruler,
  Weight,
  Shirt,
  Pill,
  Church,
  Users,
  Info,
  Shield,
  Briefcase,
  DollarSign,
  Pencil,
  UserCircle,
  Printer,
} from "lucide-react";
import { AssignTribe } from "@/components/dashboard/pessoas/assign-tribe";
import { AssignSectors } from "@/components/dashboard/pessoas/assign-sectors";
import { FinancialStatus } from "@/components/dashboard/pessoas/financial-status";
import { PessoaFormSheet } from "@/components/dashboard/pessoas/pessoa-form-sheet";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/dashboard/pessoas/avatar-upload";
import { PessoaFichaImpressao } from "@/components/dashboard/pessoas/pessoa-ficha-impressao";
import { RoleGate } from "@/components/auth/role-gate";

async function getPersonData(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pessoas")
    .select("*, edicoes(*), tribos(*), equipe_setores(setores(*)), pagamentos(*))")
    .eq("id", id)
    .single();
  
  if (error) return { person: null, error };
  
  const person = {
    ...data,
    setores: data.equipe_setores.map(es => es.setores)
  };

  return { person, error: null };
}

export default async function PessoaDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { person } = await getPersonData(params.id);

  if (!person) {
    notFound();
  }

  const formatAddress = (p: typeof person) => {
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
    <>
      <div className="no-print">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{person.nome_completo}</h1>
            <p className="text-muted-foreground">
              {person.tipo === "participante" ? "Participante" : "Membro da Equipe"} da{" "}
              <span className="font-semibold">{person.edicoes?.nome_edicao}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Imprimir Ficha
            </Button>
            <RoleGate allowedRoles={['admin', 'editor']}>
              <PessoaFormSheet 
                mode="edit"
                editionId={person.edicao_id}
                tipo={person.tipo as "participante" | "equipe"}
                initialData={person}
                trigger={<Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Editar Dados</Button>}
              />
            </RoleGate>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex items-center gap-3"><Cake className="h-4 w-4 text-muted-foreground" /> {format(new Date(person.data_nascimento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /> {person.telefone || "Não informado"}</p>
                <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /> {person.email || "Não informado"}</p>
                <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /> {formatAddress(person)}</p>
              </CardContent>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Shirt className="h-5 w-5" /> Físico</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="flex items-center gap-3"><Ruler className="h-4 w-4 text-muted-foreground" /> {person.altura_cm ? `${person.altura_cm} cm` : "N/A"}</p>
                  <p className="flex items-center gap-3"><Weight className="h-4 w-4 text-muted-foreground" /> {person.peso_kg ? `${person.peso_kg} kg` : "N/A"}</p>
                  <p className="flex items-center gap-3"><Shirt className="h-4 w-4 text-muted-foreground" /> Camiseta: <Badge variant="outline">{person.tamanho_camiseta || "N/A"}</Badge></p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Pill className="h-5 w-5" /> Saúde</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p><strong>Medicamentos:</strong> {person.toma_medicamento_continuo ? person.medicamentos_continuos : "Não"}</p>
                  <p><strong>Alergias:</strong> {person.possui_alergias ? person.alergias : "Não"}</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Church className="h-5 w-5" /> Comunidade</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex items-center gap-3"><Users className="h-4 w-4 text-muted-foreground" /> Paróquia: {person.paroquia || "Não informado"}</p>
                <p className="flex items-center gap-3"><Users className="h-4 w-4 text-muted-foreground" /> Comunidade: {person.comunidade || "Não informado"}</p>
                <p><strong>Servo do Enchei-vos:</strong> {person.e_servo ? "Sim" : "Não"}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="h-5 w-5" /> Foto de Perfil</CardTitle></CardHeader>
              <CardContent>
                <AvatarUpload personId={person.id} currentAvatarUrl={person.avatar_url} personName={person.nome_completo} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" /> Financeiro</CardTitle></CardHeader>
              <CardContent>
                <FinancialStatus person={person} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Tribo</CardTitle></CardHeader>
              <CardContent>
                <AssignTribe personId={person.id} currentTribeId={person.tribo_id} />
              </CardContent>
            </Card>

            {person.tipo === 'equipe' && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Setores de Trabalho</CardTitle></CardHeader>
                <CardContent>
                  <AssignSectors personId={person.id} assignedSectors={person.setores || []} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <PessoaFichaImpressao person={person} />
    </>
  );
}