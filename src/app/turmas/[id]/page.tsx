
import { auth } from "@/auth"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
    GraduationCap,
    BookOpen,
    CalendarDays,
    Hash,
    Users,
    ArrowLeft
} from "lucide-react";
import { Separator } from "@radix-ui/react-select"
import { Button } from "@/components/ui/button"
import { MatriculaForm } from "../_components/matricula-form"
import { MatriculaItem } from "../_components/matricula-item"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function detalhesTurmas({ params }: PageProps) {
    const session = await auth()
    if (!session) {
        redirect('/login')
    }

    const { id } = await params;

    const [turma, todosAlunos] = await Promise.all([
        prisma.turma.findUnique({
            where: { id },
            include: {
                professor: true,
                disciplina: true,
                matriculas: {
                    include: { aluno: true },
                    orderBy: { aluno: { nome: 'asc' } }
                }
            }
        }),
        prisma.aluno.findMany({
            where: { ativo: true },
            orderBy: { nome: 'asc' },
            select: { id: true, nome: true, matricula: true }
        })
    ]);

    if (!turma) {
        notFound()
    }

    const idsMatriculados = new Set(turma.matriculas.map(m => m.alunoId));
    const alunosParaMatricular = todosAlunos.filter(a => !idsMatriculados.has(a.id));


    return (
        <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">

            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild className="h-9 w-9 bg-white shadow-sm hover:bg-slate-50 border-slate-200">
                    <Link href="/turmas">
                        <ArrowLeft className="h-4 w-4 text-slate-600" />
                    </Link>
                </Button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {turma.nome}
                        </h1>
                        <Badge
                            variant={turma.ativo ? "default" : "secondary"}
                            className={turma.ativo
                                ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none px-2.5"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 shadow-none px-2.5"
                            }
                        >
                            {turma.ativo ? "Turma Ativa" : "Encerrada"}
                        </Badge>
                    </div>
                    <p className="text-slate-500 text-sm flex items-center gap-2">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{turma.codigo}</span>
                        <span>•</span>
                        <span>{turma.disciplina.nome}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

               
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-blue-600" />
                                    Alunos Matriculados
                                </CardTitle>
                                <p className="text-xs text-slate-500">
                                    Total de {turma.matriculas.length} estudantes nesta turma.
                                </p>
                            </div>

                          
                            <MatriculaForm
                                turmaId={turma.id}
                                alunosDisponiveis={alunosParaMatricular}
                            />
                        </CardHeader>

                        <CardContent className="p-0">
                            <ul className="divide-y divide-slate-100">
                                {turma.matriculas.map((matricula) => (
                                    <MatriculaItem key={matricula.id} matricula={matricula} />
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

               
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                Dados da Turma
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 text-sm">

                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                    <GraduationCap className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Professor</p>
                                    <p className="text-slate-500">{turma.professor.nome}</p>
                                </div>
                            </div>

                            <Separator className="bg-slate-100" />

                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <BookOpen className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Disciplina</p>
                                    <p className="text-slate-500">{turma.disciplina.nome}</p>
                                </div>
                            </div>

                            <Separator className="bg-slate-100" />

                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                    <Hash className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Código</p>
                                    <p className="text-slate-500 font-mono">{turma.codigo}</p>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

