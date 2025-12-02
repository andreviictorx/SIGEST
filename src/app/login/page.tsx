'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { realizarLoginAction } from "@/actions/auth";
import { loginSchema } from "@/lib/schema";

import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { SubmitButton } from "@/components/SubmitButton";

import { Mail, Lock, GraduationCap } from "lucide-react";
export default function PaginaLogin() {
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<loginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: loginSchema) {
        setServerError(null);
        const result = await realizarLoginAction(values);

        if (result?.erro) {
            setServerError(result.erro);
            toast.error("Falha no login", {
                description: result.erro,
            });
        }
    }

    return (
       
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2">

           
            <div className="hidden bg-slate-900 lg:flex flex-col justify-between p-10 relative overflow-hidden">
              
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-slate-900 z-0 pointer-events-none" />

                <div className="relative z-10 flex items-center gap-2 font-bold text-lg text-white">
                    <GraduationCap className="h-6 w-6 text-blue-400" />
                    <span>SIGESTE</span>
                </div>

                <div className="relative z-10 mb-20">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                        Gestão Escolar Inteligente e Simplificada.
                    </h1>
                    <p className="text-slate-300 text-lg max-w-md">
                        Acesse sua conta para gerenciar alunos, turmas e diários de classe em um só lugar.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-slate-400">
                    © {new Date().getFullYear()} SIGESTE. Todos os direitos reservados.
                </div>
            </div>

           
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div className="mx-auto w-full max-w-[400px] space-y-8">

                 
                    <div className="flex flex-col space-y-2 text-center">
                       
                        <GraduationCap className="h-10 w-10 text-blue-600 mx-auto lg:hidden" />
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Acesse sua conta
                        </h2>
                        <p className="text-sm text-slate-500">
                            Entre com suas credenciais acadêmicas abaixo.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Email</FormLabel>
                                        <FormControl>
                                           
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <Input
                                                    placeholder="admin@escola.com"
                                                    type="email"
                                                    
                                                    className="pl-10 bg-white border-slate-300 focus-visible:ring-blue-600 text-slate-900 h-11"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Senha</FormLabel>
                                        <FormControl>
                                            
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <Input
                                                    placeholder="******"
                                                    type="password"
                                                    className="pl-10 bg-white border-slate-300 focus-visible:ring-blue-600 text-slate-900 h-11"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />

                            {serverError && (
                                <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200 flex items-center gap-2 font-medium animate-in fade-in-50">
                                    ⚠️ {serverError}
                                </div>
                            )}

                            <SubmitButton
                                text="Entrar no Sistema"
                                loadingText="Autenticando..."
                              
                                className="w-full h-11 bg-green-600 hover:bg-green-700 font-bold shadow-sm text-white cursor-pointer"
                                isLoading={form.formState.isSubmitting}
                            />
                        </form>
                    </Form>
                </div>
            </div>

        </div>
    );
}