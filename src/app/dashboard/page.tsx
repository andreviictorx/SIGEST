import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CardDashboard from "@/components/card-dashboard";
import { prisma } from "@/lib/prisma";
import { ActivityIcon, BookOpen, GraduationCap, History, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export default async function Dashboard() {

    const session = await auth();
    if (!session) {
        redirect("/login");
    }
    const [quantidadeTotalAlunos, quantidadeTotalProfessores, quantidadeTurmasAtivas, matriculasRecentes] = await Promise.all([
        prisma.aluno.count({
            where: { ativo: true }
        }),
        prisma.professor.count({
            where: { ativo: true }
        }),
        prisma.turma.count({
            where: { ativo: true }
        }),
        prisma.matricula.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                aluno: {
                    select: { nome: true }
                },
                turma: {
                    select: {
                        nome: true, disciplina: {
                            select: { nome: true }
                        }
                    }
                }
            }
        })
    ])
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };
    const getInitials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
    return (
        <div className="space-y-8 p-8 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500">Visão geral da sua escola em tempo real.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CardDashboard
                    value={quantidadeTotalAlunos}
                    label="Alunos ativos matriculados"
                    icon={<Users className="h-4 w-4" />}
                />
                <CardDashboard
                  
                    value={quantidadeTotalProfessores}
                    label="Corpo docente registrado"
                    icon={<GraduationCap className="h-4 w-4" />}
                />
                <CardDashboard
                    value={quantidadeTurmasAtivas}
                    label="Turmas em andamento"
                    icon={<BookOpen className="h-4 w-4" />}
                />
                <CardDashboard
                    value={matriculasRecentes.length}
                    label="Novas matrículas recentes"
                    icon={<History className="h-4 w-4" />}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <Card className="col-span-4 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-800">Matrículas Recentes</CardTitle>
                        <CardDescription>
                            Os últimos alunos vinculados a turmas neste mês.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {matriculasRecentes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
                                 <ActivityIcon /> 
                                <p>Nenhuma atividade registrada recentemente.</p>
                            </div>
                        ) : (
                            <div>
                                {matriculasRecentes.map((item, index) => (
                                    <div key={index} className="flex justify-center items-center group">
                                        <Avatar className="h-10 w-10 border border-slate-200 rounded-full pl-4 py-1 ">
                                            <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">
                                                {getInitials(item.aluno.nome)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none text-slate-900">
                                                {item.aluno.nome}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Entrou em <span className="font-semibold text-slate-700">{item.turma.disciplina.nome}</span>
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-slate-400">
                                            {formatDate(item.createdAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-slate-200 shadow-sm bg-slate-50/50 border-dashed flex flex-col items-center justify-center text-center p-8">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <div className="h-6 w-6 text-slate-400" >
                            <ActivityIcon />
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Gráficos em Breve</h3>
                    <p className="text-xs text-slate-500 max-w-[200px] mt-1">
                        Na próxima versão, implementaremos gráficos de desempenho e frequência aqui.
                    </p>
                </Card>

            </div>
        </div>
    );
}