'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { matricularAlunoAction } from "@/actions/turma"; 
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";
import { MatriculaSchema, matriculaSchema } from "@/lib/schema";



interface MatriculaFormProp {
    turmaId: string,
    alunosDisponiveis:{
        id: string,
        nome:string,
        matricula: string
    }[];
}
export function MatriculaForm({turmaId, alunosDisponiveis}: MatriculaFormProp){
    const [open, setOpen] = useState(false);

    const form = useForm<MatriculaSchema>({
        resolver: zodResolver(matriculaSchema),
        defaultValues: {
            alunoId: "",
        },
    });

    async function onSubmit(values: MatriculaSchema){
        const result = await matricularAlunoAction(turmaId, values.alunoId)
        if(result.sucesso){
            toast.success("Aluno matriculado!");
            setOpen(false);
            form.reset();
        }else{
            toast.error(result.erro);
        }
    }
    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) form.reset(); }}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm gap-2 cursor-pointer">
                    <UserPlus className="h-4 w-4" /> Adicionar Aluno
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px] bg-white border border-slate-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-800">Nova Matrícula</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Selecione um aluno da lista para adicionar a esta turma.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">

                        <FormField
                            control={form.control}
                            name="alunoId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Aluno</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white border-slate-300 text-slate-900 focus:ring-blue-600 h-11">
                                                <SelectValue placeholder="Selecione o aluno..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white border-slate-200 z-[9999] max-h-[300px]">
                                            {alunosDisponiveis.length > 0 ? (
                                                alunosDisponiveis.map((aluno) => (
                                                    <SelectItem key={aluno.id} value={aluno.id} className="cursor-pointer">
                                                        <span className="font-medium">{aluno.nome}</span>
                                                        <span className="text-slate-400 ml-2 text-xs">({aluno.matricula})</span>
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-slate-500">
                                                    Nenhum aluno disponível para matrícula.
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <SubmitButton
                                text="Confirmar Matrícula"
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