"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { addPessoa, updatePessoa } from "@/app/dashboard/edicoes/[id]/actions";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Pencil } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const pessoaSchema = z.object({
  nome_completo: z.string().min(3, "Nome é obrigatório."),
  data_nascimento: z.date({ required_error: "Data de nascimento é obrigatória." }),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido.").optional().or(z.literal('')),
  endereco_rua: z.string().optional(),
  endereco_numero: z.string().optional(),
  endereco_complemento: z.string().optional(),
  endereco_bairro: z.string().optional(),
  endereco_cidade: z.string().optional(),
  endereco_estado: z.string().optional(),
  endereco_cep: z.string().optional(),
  altura_cm: z.coerce.number().optional(),
  peso_kg: z.coerce.number().optional(),
  tamanho_camiseta: z.string().optional(),
  toma_medicamento_continuo: z.boolean().default(false),
  medicamentos_continuos: z.string().optional(),
  possui_alergias: z.boolean().default(false),
  alergias: z.string().optional(),
  e_servo: z.boolean().default(false),
  paroquia: z.string().optional(),
  comunidade: z.string().optional(),
  observacoes: z.string().optional(),
});

type PessoaSchemaType = z.infer<typeof pessoaSchema>;
type PessoaTipo = "participante" | "equipe";

interface PessoaFormSheetProps {
  editionId: string;
  tipo: PessoaTipo;
  mode: "add" | "edit";
  initialData?: Partial<PessoaSchemaType> & { id?: string };
  trigger?: React.ReactNode;
}

export function PessoaFormSheet({ editionId, tipo, mode, initialData, trigger }: PessoaFormSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  
  const defaultValues = mode === 'edit' && initialData ? {
    ...initialData,
    data_nascimento: initialData.data_nascimento ? new Date(initialData.data_nascimento) : undefined,
  } : {
    nome_completo: "",
    telefone: "",
    email: "",
    tamanho_camiseta: "M",
    toma_medicamento_continuo: false,
    possui_alergias: false,
    e_servo: false,
  };

  const form = useForm<PessoaSchemaType>({
    resolver: zodResolver(pessoaSchema),
    defaultValues,
  });

  const watchTomaMedicamento = form.watch("toma_medicamento_continuo");
  const watchPossuiAlergias = form.watch("possui_alergias");

  async function onSubmit(values: PessoaSchemaType) {
    let result;
    if (mode === 'edit' && initialData?.id) {
      result = await updatePessoa(initialData.id, values);
    } else {
      result = await addPessoa(editionId, tipo, values);
    }

    if (result.success) {
      toast.success(mode === 'edit' ? 'Dados atualizados com sucesso!' : `${tipo === 'participante' ? 'Participante' : 'Membro'} adicionado(a) com sucesso!`);
      setIsOpen(false);
      if (mode === 'add') form.reset();
    } else {
      toast.error(result.error);
    }
  }

  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      return;
    }

    setIsCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        toast.error("CEP não encontrado.");
        return;
      }
      form.setValue("endereco_rua", data.logradouro);
      form.setValue("endereco_bairro", data.bairro);
      form.setValue("endereco_cidade", data.localidade);
      form.setValue("endereco_estado", data.uf);
      toast.success("Endereço preenchido automaticamente!");
    } catch (error) {
      toast.error("Falha ao buscar CEP.");
    } finally {
      setIsCepLoading(false);
    }
  };
  
  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Editar Dados' : (tipo === 'participante' ? 'Adicionar Novo Participante' : 'Adicionar Membro da Equipe');
  const description = isEditMode ? 'Altere os dados conforme necessário.' : `Preencha os dados do novo ${tipo === 'participante' ? 'participante' : 'membro da equipe'}.`;
  const buttonText = isEditMode ? 'Salvar Alterações' : (tipo === 'participante' ? 'Adicionar Participante' : 'Adicionar Membro');

  const defaultTrigger = (
    <Button>
      {isEditMode ? <><Pencil className="mr-2 h-4 w-4" /> Editar</> : buttonText}
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent className="sm:max-w-2xl w-full">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[calc(100vh-150px)] pr-6">
              <div className="space-y-4 py-4">
                <h3 className="font-semibold text-lg mb-2">Dados Pessoais</h3>
                <FormField name="nome_completo" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="data_nascimento" control={form.control} render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Data de Nascimento</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1920-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField name="telefone" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <h3 className="font-semibold text-lg mt-6 mb-2">Endereço</h3>
                <FormField name="endereco_cep" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input {...field} onBlur={handleCepBlur} disabled={isCepLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="endereco_rua" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Rua</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-3 gap-4">
                  <FormField name="endereco_numero" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="endereco_complemento" control={form.control} render={({ field }) => (
                    <FormItem className="col-span-2"><FormLabel>Complemento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField name="endereco_bairro" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="endereco_cidade" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField name="endereco_estado" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Estado</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <h3 className="font-semibold text-lg mt-6 mb-2">Informações Físicas</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField name="altura_cm" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Altura (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="peso_kg" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Peso (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="tamanho_camiseta" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Camiseta</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl><SelectContent><SelectItem value="P">P</SelectItem><SelectItem value="M">M</SelectItem><SelectItem value="G">G</SelectItem><SelectItem value="GG">GG</SelectItem><SelectItem value="XG">XG</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                </div>

                <h3 className="font-semibold text-lg mt-6 mb-2">Saúde</h3>
                <FormField name="toma_medicamento_continuo" control={form.control} render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Toma medicamento contínuo?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )} />
                {watchTomaMedicamento && <FormField name="medicamentos_continuos" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Quais medicamentos?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />}
                <FormField name="possui_alergias" control={form.control} render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Possui alergias?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )} />
                {watchPossuiAlergias && <FormField name="alergias" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Quais alergias?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />}

                <h3 className="font-semibold text-lg mt-6 mb-2">Serviços e Comunidade</h3>
                <FormField name="e_servo" control={form.control} render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>É servo do Enchei-vos?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )} />
                <FormField name="paroquia" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Paróquia que participa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="comunidade" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Comunidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <h3 className="font-semibold text-lg mt-6 mb-2">Observações</h3>
                <FormField name="observacoes" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Observações Gerais</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </ScrollArea>
            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </SheetClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : buttonText}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}