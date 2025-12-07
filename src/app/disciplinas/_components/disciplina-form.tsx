'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  disciplinaSchema, DisciplinaSchema } from "@/lib/schema";


import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { criarDisciplinaAction } from "@/actions/disciplina";


export function DisciplinaForm() {
    const [open, setOpen] = useState(false);

    const form = useForm<DisciplinaSchema>({
        resolver: zodResolver(disciplinaSchema),
        defaultValues: {
            nome: "",
            codigo:"",
            cargaHoraria:0
        },
    });

    async function onSubmit(values: DisciplinaSchema) {
        const resultado = await criarDisciplinaAction(values);

        if (resultado.success) {
            setOpen(false);
            form.reset();
            toast.success('Disciplina matriculado com sucesso', {
                description: `A Disciplina ${values.nome} já está na lista`
            })
        } else {
            toast.error("Falha ao matricular", {
                description: resultado.erro,
            });
        }
    }

    const onOpenChangeWrapper = (open: boolean) => {
        setOpen(open);
        if (!open) form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeWrapper}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm cursor-pointer">
                    <UserPlus className="mr-2 h-4 w-4 " /> Nova Disciplina
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-white border border-slate-200 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        Criar Disciplina
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Insira os dados cadastrais da nova disciplina.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">

                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Nome da Disciplina</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Matematica"
                                            className="bg-white border-slate-300 text-slate-900 focus-visible:ring-blue-600"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">

                            <FormField
                                control={form.control}
                                name="codigo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Codigo</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="MTM2025"
                                                className="bg-white border-slate-300 text-slate-900 focus-visible:ring-blue-600"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="cargaHoraria"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Carga Horária</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="20H"
                                                className="bg-white border-slate-300 text-slate-900 focus-visible:ring-blue-600"
                                                
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value === "" ? 0 : Number(value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}

                                className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto transition-all cursor-pointer"
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Matriculando...
                                    </>
                                ) : (
                                    "Confirmar Matrícula"
                                )}
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};