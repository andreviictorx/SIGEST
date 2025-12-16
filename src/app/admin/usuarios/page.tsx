import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users } from "lucide-react";
import { UserForm } from "./_components/user-form";

export default async function UsuariosPage() {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                    <Shield className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestão de Acessos</h1>
                    <p className="text-slate-500 text-sm">Controle de logins e permissões do sistema.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">

                <div className="md:col-span-5">
                    <UserForm />
                </div>


                <div className="md:col-span-7">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-slate-500" />
                                    <CardTitle className="text-base font-semibold text-slate-800">Usuários Ativos</CardTitle>
                                </div>
                                <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                                    Total: {users.length}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                                                {user.name?.substring(0, 2).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide
                      ${user.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-100' :
                                                user.role === 'PROFESSOR' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}