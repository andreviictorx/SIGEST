'use client';


import { realizarLoginAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SubmitButton } from "@/components/SubmitButton";
import { useActionState } from "react";

export default function PaginaLogin() {
    const [estado, formAction] = useActionState(realizarLoginAction, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">SIGESTE</CardTitle>
                    <CardDescription className="text-center">
                        Entre com suas credenciais acadêmicas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@escola.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="******"
                                required
                            />
                        </div>


                        {estado?.erro && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                ⚠️ {estado.erro}
                            </div>
                        )}

                        <SubmitButton
                            text="Entrar no Sistema"
                            loadingText="Autenticando..."
                            className="w-full mt-4"
                        />

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}