'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { alunoSchema, AlunoSchema } from "@/lib/schema";
import { criarAlunoAction } from "@/actions/alunos";

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

export function AlunoForm() {
    const [open, setOpen] = useState(false);

    const form = useForm<AlunoSchema>({
        resolver: zodResolver(alunoSchema),
        defaultValues: {
            nome: "",
            email: "",
            matricula: "",
            telefone: "",
        },
    });

    async function onSubmit(values: AlunoSchema) {
        const resultado = await criarAlunoAction(values);

        if (resultado.sucesso) {
            setOpen(false);
            form.reset();
            toast.success('Aluno matriculado com sucesso',{
                description: `O aluno ${values.nome} já está na lista`
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
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                    <UserPlus className="mr-2 h-4 w-4" /> Novo Aluno
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-white border border-slate-200 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        Matricular Aluno
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Insira os dados cadastrais do novo aluno.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">

                        {/* Campo Nome */}
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Ana Souza"
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="ana@escola.com"
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
                                name="matricula"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Matrícula</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="2024001"
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
                            name="telefone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Telefone</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="(11) 99999-9999"
                                            className="bg-white border-slate-300 text-slate-900 focus-visible:ring-blue-600"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}

                                className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto transition-all"
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
}