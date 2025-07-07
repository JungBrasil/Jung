"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { addPessoa, updatePessoa } from "@/app/dashboard/edicoes/[id]/actions";
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
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
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

interface PessoaFormSheetProps {
  mode: "add" | "edit";
  editionId: string;
  tipo: "participante" | "equipe";
  initialData?: Partial<PessoaSchemaType> & { id?: string };
  trigger: React.ReactNode;
}

export function PessoaFormSheet({ mode, editionId, tipo, initialData, trigger }: PessoaFormSheetProps) {
  const form = useForm<PessoaSchemaType>({
    resolver: zodResolver(pessoaSchema),
    defaultValues: {
      ...initialData,
      data_nascimento: initialData?.data_nascimento ? new Date(initialData.data_nascimento) : undefined,
    },
  });

  async function onSubmit(values: PessoaSchemaType) {
    let result;
    if (mode === 'edit' && initialData?.id) {
      result = await updatePessoa(initialData.id, values);
    } else {
      result = await addPessoa(editionId, tipo, values);
    }

    if (result.success) {
      toast.success(mode === 'edit' ? 'Dados atualizados!' : 'Registro criado!');
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="sm:max-w-2xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{mode === 'edit' ? 'Editar Dados' : `Adicionar ${tipo}`}</SheetTitle>
          <SheetDescription>Preencha as informações abaixo.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Form fields here */}
            <FormField name="nome_completo" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            {/* ... other fields ... */}
            <SheetFooter>
              <SheetClose asChild><Button type="button" variant="outline">Cancelar</Button></SheetClose>
              <Button type="submit">Salvar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}