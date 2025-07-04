"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { addParticipant } from "@/app/dashboard/edicoes/[id]/actions";

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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const participantSchema = z.object({
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

export function AddParticipantSheet({ editionId }: { editionId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof participantSchema>>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      nome_completo: "",
      telefone: "",
      email: "",
      tamanho_camiseta: "M",
      toma_medicamento_continuo: false,
      possui_alergias: false,
      e_servo: false,
    },
  });

  const watchTomaMedicamento = form.watch("toma_medicamento_continuo");
  const watchPossuiAlergias = form.watch("possui_alergias");

  async function onSubmit(values: z.infer<typeof participantSchema>) {
    const result = await addParticipant(editionId, values);
    if (result.success) {
      toast.success("Participante adicionado com sucesso!");
      setIsOpen(false);
      form.reset();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>Adicionar Participante</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl w-full">
        <SheetHeader>
          <SheetTitle>Adicionar Novo Participante</SheetTitle>
          <SheetDescription>
            Preencha os dados do participante.
          </SheetDescription>
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
                  <FormItem><FormLabel>CEP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
                {form.formState.isSubmitting ? "Salvando..." : "Salvar Participante"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}