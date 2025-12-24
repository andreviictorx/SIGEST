'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { professorSchema, ProfessorSchema } from "@/lib/schema";


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
import { alterarDadosProfessoresAction, criarProfessorAction } from "@/actions/professor";

interface ProfessorFormData {
    professorData: {
        id: string,
        nome: string,
        email: string,
        matricula: string
    }
}

export function ProfessorForm({ professorData }: ProfessorFormData) {
    const [open, setOpen] = useState(false);
    const isEditing = !!professorData;


    const form = useForm<ProfessorSchema>({
        resolver: zodResolver(professorSchema),
        defaultValues: {
            nome: "",
            matricula: "",
            email: ""
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                nome: professorData.nome || "",
                email: professorData.email || "",
                matricula: professorData.matricula || "",
            });
        }
    }, [open, professorData, form]);

    async function onSubmit(values: ProfessorSchema) {
        if (isEditing && professorData) {
            const result = await alterarDadosProfessoresAction(professorData.id, values);
            if (result.success) {
                setOpen(false);
                form.reset();
                toast.success('Dados do professor atualizado com sucesso', {
                    description: `Veja suas informações`
                })
            } else {
                toast.error("Falha ao atualizar os dados", {
                    description: result.erro,
                });
            }
        } else {
            const result = await criarProfessorAction(values);

            if (result.success) {
                setOpen(false)
                form.reset();
                toast.success('Professor  matriculado com sucesso', {
                    description: `Veja suas informações`
                })
            } else {
                toast.error("Falha ao matricular", {
                    description: result.erro,
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
                        <UserPlus className="mr-2 h-4 w-4" /> Novo Professor
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-white border border-slate-200 shadow-xl">
                <DialogHeader>
                    {isEditing ? (
                        <>
                            <DialogTitle className="text-xl font-bold text-slate-800">
                                Editar professor
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                                Insira os dados atualizados do professor.
                            </DialogDescription>
                        </>
                    ) : (
                        <>
                            <DialogTitle className="text-xl font-bold text-slate-800">
                                Criar professor
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                                Insira os dados cadastrais do novo professor.
                            </DialogDescription>
                        </>
                    )}

                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">

                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Nome do Professor</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Paulo Silva"
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
                                name="matricula"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Matricula</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="PR-545"
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="andre@gmail.com"
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
};