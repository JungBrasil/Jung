"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { addEdition, updateEdition, deleteEdition } from "@/app/dashboard/edicoes/actions";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { RoleGate } from "@/components/auth/role-gate";

const editionSchema = z.object({
  nome_edicao: z.string().min(3, "Nome da edição é obrigatório."),
  numero_edicao: z.coerce.number().min(1, "Número da edição é obrigatório."),
  local: z.string().min(3, "Local é obrigatório."),
  data_inicio: z.date({ required_error: "Data de início é obrigatória." }),
  data_fim: z.date({ required_error: "Data de fim é obrigatória." }),
  taxa_inscricao: z.coerce.number().min(0, "Taxa de inscrição deve ser positiva."),
});

type EditionSchemaType = z.infer<typeof editionSchema>;

interface EditionFormDialogProps {
  mode: "add" | "edit";
  initialData?: Partial<EditionSchemaType> & { id?: string };
}

export function EditionFormDialog({ mode, initialData }: EditionFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const defaultValues = mode === 'edit' && initialData ? {
    ...initialData,
    data_inicio: initialData.data_inicio ? new Date(initialData.data_inicio) : undefined,
    data_fim: initialData.data_fim ? new Date(initialData.data_fim) : undefined,
  } : {
    taxa_inscricao: 0,
  };

  const form = useForm<EditionSchemaType>({
    resolver: zodResolver(editionSchema),
    defaultValues,
  });

  async function onSubmit(values: EditionSchemaType) {
    let result;
    if (mode === 'edit' && initialData?.id) {
      result = await updateEdition(initialData.id, values);
    } else {
      result = await addEdition(values);
    }

    if (result.success) {
      toast.success(mode === 'edit' ? 'Edição atualizada com sucesso!' : 'Edição criada com sucesso!');
      setIsOpen(false);
      form.reset();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (mode !== 'edit' || !initialData?.id) return;

    if (confirm("Tem certeza que deseja excluir esta edição? Esta ação não pode ser desfeita.")) {
      const result = await deleteEdition(initialData.id);
      if (result.success) {
        toast.success("Edição excluída com sucesso!");
        setIsOpen(false);
        router.push("/dashboard/edicoes");
      } else {
        toast.error(result.error);
      }
    }
  }
  
  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Editar Edição' : 'Criar Nova Edição';
  const description = isEditMode ? 'Altere os dados da edição.' : 'Preencha os dados para criar uma nova edição do acampamento.';
  const buttonText = isEditMode ? 'Salvar Alterações' : 'Criar Edição';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <RoleGate allowedRoles={['admin']}>
        <DialogTrigger asChild>
          <Button variant={isEditMode ? "outline" : "default"}>
            {isEditMode ? <><Pencil className="mr-2 h-4 w-4" /> Editar</> : 'Criar Nova Edição'}
          </Button>
        </DialogTrigger>
      </RoleGate>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="nome_edicao" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Nome da Edição</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="numero_edicao" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Número da Edição</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField name="local" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Local</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField name="data_inicio" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Data de Início</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
              )} />
              <FormField name="data_fim" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Data de Fim</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
              )} />
            </div>
            <FormField name="taxa_inscricao" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Taxa de Inscrição (R$)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter className="pt-4">
              {isEditMode && (
                <RoleGate allowedRoles={['admin']}>
                  <Button type="button" variant="destructive" onClick={handleDelete} className="mr-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                  </Button>
                </RoleGate>
              )}
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}