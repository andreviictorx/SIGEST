import { getAdminDashboardMetrics } from "@/actions/dashboard";
import CardDashboard from "@/components/card-dashboard"; 
import { OverviewChart } from "@/components/overview-chart"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon, BookOpen, GraduationCap, History, Users, BarChart3 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(date);
};

const getInitials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

export async function AdminView() {
   
    const data = await getAdminDashboardMetrics();

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Visão Geral</h2>
                <p className="text-slate-500">Métricas estratégicas da instituição.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CardDashboard
                    value={data.quantidadeTotalAlunos}
                    label="Alunos Ativos"
                    icon={<Users className="h-4 w-4" />}
                />
                <CardDashboard
                    value={data.quantidadeTotalProfessores}
                    label="Professores"
                    icon={<GraduationCap className="h-4 w-4" />}
                />
                <CardDashboard
                    value={data.quantidadeTurmasAtivas}
                    label="Turmas Ativas"
                    icon={<BookOpen className="h-4 w-4" />}
                />
                <CardDashboard
                    value={data.matriculasRecentes.length}
                    label="Novas Matrículas"
                    icon={<History className="h-4 w-4" />}
                />
            </div>

        
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">

              
                <Card className="col-span-1 lg:col-span-4 border-slate-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            Desempenho Acadêmico
                        </CardTitle>
                        <CardDescription>
                            Média de notas por disciplina ativa.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">

                        <OverviewChart data={data.graficoDesempenho} />
                    </CardContent>
                </Card>

            
                <Card className="col-span-1 lg:col-span-3 border-slate-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <ActivityIcon className="h-4 w-4 text-orange-500" />
                            Matrículas Recentes
                        </CardTitle>
                        <CardDescription>
                            Últimos alunos vinculados a turmas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.matriculasRecentes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
                                <ActivityIcon className="h-10 w-10 mb-2 opacity-10" />
                                <p className="text-sm">Nenhuma atividade recente.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {data.matriculasRecentes.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border border-slate-100">
                                                <AvatarFallback className="bg-blue-50 text-blue-700 text-[10px] font-bold">
                                                    {getInitials(item.aluno.nome)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium leading-none text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {item.aluno.nome}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate max-w-[150px]">
                                                    {item.turma.disciplina.nome}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded-full">
                                            {formatDate(item.createdAt).split(',')[0]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}