'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { criarUsuario } from "@/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Lock, Shield, UserPlus, CheckCircle2, GraduationCap, BookOpen } from "lucide-react"
import { UsuarioSchema, usuarioSchema } from "@/lib/schema"

export function UserForm() {
    const form = useForm<UsuarioSchema>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "ALUNO",
        },
    })

    async function onSubmit(values: UsuarioSchema) {
        try {
            const result = await criarUsuario(values);

            if (result.success) {
                toast.success("Usuário criado!", {
                    description: `O acesso para ${values.name} foi gerado com sucesso.`,
                    icon: <CheckCircle2 className="text-green-500" />
                });
                form.reset();
            } else {
                toast.error("Erro ao criar", { description: result.message });
            }
        } catch (error) {
            toast.error("Erro inesperado", { description: "Tente novamente." });
        }
    }

    return (
        <Card className="border-slate-200 shadow-md overflow-hidden sticky top-24">

            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <UserPlus className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-bold text-slate-800">Novo Cadastro</CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                            Preencha os dados para criar um novo acesso.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">


                        <div className="grid gap-5 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nome Completo</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input placeholder="Ex: Maria Silva" className="pl-9 bg-slate-50/50 focus:bg-white transition-colors" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wide">E-mail</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input placeholder="maria@escola.com" className="pl-9 bg-slate-50/50 focus:bg-white transition-colors" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="grid gap-5 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Senha Inicial</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input type="password" placeholder="******" className="pl-9 bg-slate-50/50 focus:bg-white transition-colors" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tipo de Perfil</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <div className="relative">
                                                    <Shield className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                                                    <SelectTrigger className="pl-9 bg-slate-50/50 focus:bg-white transition-colors h-10">
                                                        <SelectValue placeholder="Selecione..." />
                                                    </SelectTrigger>
                                                </div>
                                            </FormControl>

                                            <SelectContent
                                                position="popper"
                                                className="bg-white border-slate-100 shadow-xl w-(--radix-select-trigger-width)"
                                                sideOffset={5}
                                            >
                                                <SelectItem value="ALUNO" className="cursor-pointer focus:bg-slate-50 py-2.5">
                                                    <div className="flex items-center gap-2 text-slate-700">
                                                        <GraduationCap className="h-4 w-4 text-blue-600" />
                                                        <span>Aluno</span>
                                                    </div>
                                                </SelectItem>

                                                <SelectItem value="PROFESSOR" className="cursor-pointer focus:bg-slate-50 py-2.5">
                                                    <div className="flex items-center gap-2 text-slate-700">
                                                        <BookOpen className="h-4 w-4 text-purple-600" />
                                                        <span>Professor</span>
                                                    </div>
                                                </SelectItem>

                                                <SelectItem value="ADMIN" className="cursor-pointer focus:bg-slate-50 py-2.5">
                                                    <div className="flex items-center gap-2 text-slate-700">
                                                        <Shield className="h-4 w-4 text-red-600" />
                                                        <span>Administrador</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-slate-800 h-11 text-sm text-white font-medium shadow-md transition-all hover:translate-y[-1px]"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <span className="flex items-center gap-2 text-white">Criando...</span>
                                ) : (
                                    "Confirmar Cadastro"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}