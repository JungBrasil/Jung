"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Pencil } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addEdition, updateEdition } from "@/app/dashboard/edicoes/actions";
import { toast } from "sonner";

const formSchema = z.object({
  numero_edicao: z.coerce.number().min(1, "Número da edição é obrigatório."),
  nome_edicao: z.string().min(3, "Nome da edição é obrigatório."),
  local: z.string().optional(),
  data_inicio: z.date({ required_error: "Data de início é obrigatória." }),
  data_fim: z.date({ required_error: "Data de término é obrigatória." }),
  taxa_inscricao: z.coerce.number().min(0, "A taxa não pode ser negativa.").optional(),
});

type EditionSchema = z.infer<typeof formSchema>;

interface EditionFormDialogProps {
  mode: "add" | "edit";
  initialData?: Partial<EditionSchema> & { id?: string };
  trigger?: React.ReactNode;
}

export function EditionFormDialog({ mode, initialData, trigger }: EditionFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues = mode === 'edit' && initialData ? {
    ...initialData,
    data_inicio: initialData.data_inicio ? new Date(initialData.data_inicio) : undefined,
    data_fim: initialData.data_fim ? new Date(initialData.data_fim) : undefined,
  } : {
    numero_edicao: 1,
    nome_edicao: "",
    local: "",
    taxa_inscricao: 0,
  };

  const form = useForm<EditionSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: EditionSchema) {
    let result;
    if (mode === 'edit' && initialData?.id) {
      result = await updateEdition(initialData.id, values);
    } else {
      result = await addEdition(values);
    }

    if (result.success) {
      toast.success(mode === 'edit' ? "Edição atualizada com sucesso!" : "Edição adicionada com sucesso!");
      setIsOpen(false);
      if (mode === 'add') form.reset();
    } else {
      toast.error(result.error);
    }
  }

  const isEditMode = mode === 'edit';
  const title = isEditMode ? "Editar Edição" : "Adicionar Nova Edição";
  const description = isEditMode ? "Altere os detalhes da edição abaixo." : "Preencha os detalhes da nova edição do acampamento.";
  const buttonText = isEditMode ? "Salvar Alterações" : "Adicionar Edição";

  const defaultTrigger = (
    <Button>
      {isEditMode ? <><Pencil className="mr-2 h-4 w-4" /> Editar Edição</> : buttonText}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="numero_edicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Edição</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome_edicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Edição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Edição Primavera" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Chácara Recanto Feliz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxa_inscricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa de Inscrição (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Ex: 150.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_inicio"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Início</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_fim"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Término</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
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