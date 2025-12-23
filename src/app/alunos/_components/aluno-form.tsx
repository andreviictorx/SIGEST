'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { alunoSchema, AlunoSchema } from "@/lib/schema";
import { atualizarAlunoAction, criarAlunoAction } from "@/actions/alunos";

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
import { UserPlus, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";


interface AlunoDataForm {
    alunoData: {
        id: string;
        nome: string;
        email: string;
        matricula: string 
    }
}
export function AlunoForm({alunoData}: AlunoDataForm) {
    const [open, setOpen] = useState(false);
    const isEditing = !!alunoData;
    const form = useForm<AlunoSchema>({
        resolver: zodResolver(alunoSchema),
        defaultValues: {
            nome:"",
            email:"",
            matricula:""
        },
    });
    useEffect(() => {
        if (open) {
            form.reset({
                nome: alunoData?.nome || "",
                email: alunoData?.email || "",
                matricula: alunoData?.matricula || "",
            });
        }
    }, [open, alunoData, form]);

    
    async function onSubmit(values: AlunoSchema) {
        if(isEditing && alunoData){
            const dados = await atualizarAlunoAction(alunoData.id, values)
            if (dados?.success) {
                setOpen(false);
                form.reset();
                toast.success('Aluno atualizado com sucesso', {
                    description: `O aluno ${values.nome} foi atualizado e já está na lista`
                })
            } else {
                toast.error("Falha ao atualizar", {
                    description: dados?.erro,
                });
            }
        }else{
            const resultado = await criarAlunoAction(values);

            if (resultado.sucesso) {
                setOpen(false);
                form.reset();
                toast.success('Aluno matriculado com sucesso', {
                    description: `O aluno ${values.nome} já está na lista`
                })
            } else {
                toast.error("Falha ao matricular", {
                    description: resultado.erro,
                });
            }
        }
    }

    const onOpenChangeWrapper = (open: boolean) => {
        setOpen(open);
        if (!open) form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeWrapper}>
            <DialogTrigger asChild> 
                {isEditing ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm cursor-pointer">
                        <UserPlus className="mr-2 h-4 w-4" /> Novo Aluno
                    </Button>
                )}
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
                                            value={field.value ?? ''}
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
                                                value={field.value ?? ''}
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
                                                value={field.value ?? ''}
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
                                            value={field.value ?? ''}
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
                                className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto transition-all cursor-pointer"
                            >
                                {form.formState.isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                                ) : (
                                    isEditing ? "Salvar Alterações" : "Confirmar Matrícula"
                                )}
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}