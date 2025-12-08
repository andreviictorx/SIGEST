'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { turmaSchema, TurmaSchema } from "@/lib/schema";
import { criarTurmaAction } from "@/actions/turma";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";

interface TurmaFormProps {
  professores: { id: string; nome: string }[];
  disciplinas: { id: string; nome: string }[];
}

export function TurmaForm({ professores, disciplinas }: TurmaFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<TurmaSchema>({
    resolver: zodResolver(turmaSchema),
    defaultValues: {
      nome: "",
      codigo: "",
      professorId: "",
      disciplinaId: "",
    },
  });

  async function onSubmit(values: TurmaSchema) {
    const res = await criarTurmaAction(values);
    if (res.success) {
      toast.success("Turma criada com sucesso!");
      setOpen(false);
      form.reset();
    } else {
      toast.error(res.erro);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) form.reset(); }}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Nova Turma
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white border border-slate-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Nova Turma</DialogTitle>
          <DialogDescription className="text-slate-500">
            Preencha os dados para abrir uma nova turma.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Código</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="TUR-A" 
                        className="bg-white border-slate-300 text-slate-900 focus-visible:ring-blue-600 uppercase"
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Nome</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Manhã 2024" 
                        className="bg-white border-slate-300 text-slate-900 focus-visible:ring-blue-600"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="disciplinaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Disciplina</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-slate-300 text-slate-900 focus:ring-blue-600 cursor-pointer">
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                    </FormControl>
                   
                    <SelectContent className="bg-white border-slate-200 z-9999 max-h-[200px]">
                      {disciplinas.length > 0 ? (
                        disciplinas.map((d) => (
                          <SelectItem key={d.id} value={d.id} className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100">
                            {d.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-slate-500 text-center">Nenhuma disciplina cadastrada</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Professor Responsável</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-slate-300 text-slate-900 focus:ring-blue-600 cursor-pointer">
                        <SelectValue placeholder="Selecione o professor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-slate-200 z-9999 max-h-[200px]">
                      {professores.length > 0 ? (
                        professores.map((p) => (
                          <SelectItem key={p.id} value={p.id} className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100">
                            {p.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-slate-500 text-center">Nenhum professor cadastrado</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <SubmitButton 
                text="Criar Turma" 
                isLoading={form.formState.isSubmitting} 
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto shadow-sm text-white cursor-pointer"
              />
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}