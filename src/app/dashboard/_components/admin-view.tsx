import { prisma } from "@/lib/prisma";
import CardDashboard from "@/components/card-dashboard"; // Verifique se o caminho está certo
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon, BookOpen, GraduationCap, History, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Ajuste o import do Avatar se necessário

export async function AdminView() {
    // 1. Lógica de Banco de Dados (Server Side)
    const [quantidadeTotalAlunos, quantidadeTotalProfessores, quantidadeTurmasAtivas, matriculasRecentes] = await Promise.all([
        prisma.aluno.count({ where: { ativo: true } }),
        prisma.professor.count({ where: { ativo: true } }),
        prisma.turma.count({ where: { ativo: true } }),
        prisma.matricula.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                aluno: { select: { nome: true } },
                turma: {
                    select: {
                        nome: true,
                        disciplina: { select: { nome: true } }
                    }
                }
            }
        })
    ]);

    // Helpers de formatação
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    const getInitials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

    // 2. O Layout Visual (JSX)
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Visão Geral</h2>
                    <p className="text-slate-500">Métricas da escola em tempo real.</p>
                </div>
            </div>

            {/* Cards Superiores */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CardDashboard
                    value={quantidadeTotalAlunos}
                    label="Alunos Ativos"
                    icon={<Users className="h-4 w-4" />}
                />
                <CardDashboard
                    value={quantidadeTotalProfessores}
                    label="Professores"
                    icon={<GraduationCap className="h-4 w-4" />}
                />
                <CardDashboard
                    value={quantidadeTurmasAtivas}
                    label="Turmas Ativas"
                    icon={<BookOpen className="h-4 w-4" />}
                />
                <CardDashboard
                    value={matriculasRecentes.length}
                    label="Últimas Matrículas"
                    icon={<History className="h-4 w-4" />}
                />
            </div>

            {/* Área Inferior (Lista + Placeholder de Gráfico) */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">

                {/* Lista de Matrículas (Ocupa 4 colunas) */}
                <Card className="col-span-4 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-800">Atividade Recente</CardTitle>
                        <CardDescription>Últimos alunos vinculados a turmas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {matriculasRecentes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
                                <ActivityIcon className="h-8 w-8 mb-2 opacity-20" />
                                <p>Nenhuma atividade registrada.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {matriculasRecentes.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-9 w-9 border border-slate-100">
                                                <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-bold">
                                                    {getInitials(item.aluno.nome)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none text-slate-900">
                                                    {item.aluno.nome}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Entrou em <span className="font-semibold text-slate-700">{item.turma.disciplina.nome}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-400 font-mono">
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
                        <ActivityIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Gráficos em Breve</h3>
                    <p className="text-xs text-slate-500 max-w-[200px] mt-1">
                        Implementaremos análise de frequência e notas na próxima versão.
                    </p>
                </Card>
            </div>
        </div>
    );
}