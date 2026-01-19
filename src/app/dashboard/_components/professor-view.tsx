import { getProfessorDashboardData } from "@/actions/dashboard";
import CardDashboard from "@/components/card-dashboard"; // Reutilizando nosso componente
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CalendarCheck, ClipboardList, GraduationCap, Users, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export async function ProfessorView({ email }: { email: string }) {
    const data = await getProfessorDashboardData(email);

  
    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 border-2 border-dashed border-red-200 bg-red-50/50 rounded-xl">
                <div className="p-4 bg-white rounded-full text-red-500 shadow-sm">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-bold text-slate-900">Perfil Desvinculado</h2>
                    <p className="text-sm text-slate-500 max-w-md px-4">
                        O email <strong>{email}</strong> autenticou, mas não está cadastrado como Professor no sistema escolar.
                    </p>
                </div>
            </div>
        );
    }

    const { professor, turmas, stats } = data;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">

         
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Painel Docente
                    </h2>
                    <p className="text-slate-500">
                        Bem-vindo, Prof. <span className="font-semibold text-slate-700">{professor.nome.split(" ")[0]}</span>.
                    </p>
                </div>
            </div>

         
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CardDashboard
                    value={stats.totalTurmas}
                    label="Turmas Ativas"
                    icon={<BookOpen className="h-4 w-4" />}
                />
                <CardDashboard
                    value={stats.totalAlunos}
                    label="Total de Alunos"
                    icon={<Users className="h-4 w-4" />}
                />
       
                <CardDashboard
                    value="Em dia"
                    label="Status Diários"
                    icon={<CalendarCheck className="h-4 w-4 text-green-600" />}
                />
            </div>

            <div className="border-t border-slate-200 my-2"></div>

         
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    Minhas Disciplinas
                </h3>

                {turmas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                        <BookOpen className="h-10 w-10 text-slate-300 mb-2" />
                        <p className="text-slate-500 font-medium">Você não possui turmas ativas neste período.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {turmas.map((turma) => (
                            <Card key={turma.id} className="flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group bg-white">

                             
                                <CardHeader className="pb-3 bg-linear-to-r from-slate-50 to-white border-b border-slate-100 rounded-t-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-[10px] tracking-wider font-mono">
                                            {turma.nome || "TURMA"}
                                        </Badge>
                                        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                                            {turma._count.matriculas} Alunos
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                                        {turma.disciplina.nome}
                                    </CardTitle>
                                </CardHeader>

                              
                                <CardContent className="flex-1 pt-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Turma ativa e regular
                                    </div>
                                </CardContent>

                              
                                <CardFooter className="pt-2 pb-4 px-4 flex flex-col gap-2 bg-white rounded-b-xl">
                                    <div className="grid grid-cols-2 gap-2 w-full">
                                        
                                        <Button variant="outline" size="sm" className="w-full border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors" asChild>
                                            <Link href={`/turmas/${turma.id}?tab=frequencia`}>
                                                <CalendarCheck className="mr-2 h-3.5 w-3.5" />
                                                Chamada
                                            </Link>
                                        </Button>

                                       
                                        <Button variant="outline" size="sm" className="w-full border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors" asChild>
                                            <Link href={`/turmas/${turma.id}?tab=notas`}>
                                                <ClipboardList className="mr-2 h-3.5 w-3.5" />
                                                Notas
                                            </Link>
                                        </Button>
                                    </div>

                                   
                                    <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800 text-xs mt-1" asChild>
                                        <Link href={`/turmas/${turma.id}`}>
                                            Acessar Sala de Aula
                                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}