import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users } from "lucide-react";
import Link from "next/link";

export async function ProfessorView({ email }: { email: string }) {
    const professor = await prisma.professor.findUnique({
        where: { email },
        include: {
            turmas: {
                where: { ativo: true },
                include: {
                    disciplina: true,
                    _count: { select: { matriculas: true } }
                }
            }
        }
    });

    if (!professor) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 border-2 border-dashed border-slate-200 rounded-xl">
                <div className="p-4 bg-amber-50 rounded-full text-amber-600">
                    <Users className="h-8 w-8" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Perfil não vinculado</h2>
                    <p className="text-slate-500 max-w-md mt-1">
                        Seu login existe, mas não achamos o cadastro de professor para <strong>{email}</strong>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Olá, {professor.nome} 👋</h2>
                <p className="text-slate-500">Selecione uma turma para gerenciar notas e frequências.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {professor.turmas.length === 0 ? (
                    <p className="text-slate-500 col-span-full">Nenhuma turma encontrada.</p>
                ) : (
                    professor.turmas.map((turma) => (
                        <Card key={turma.id} className="hover:shadow-md transition-shadow border-slate-200">
                            <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100 rounded-t-xl">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
                                    <BookOpen className="h-4 w-4 text-blue-600" />
                                    {turma.disciplina.nome}
                                </CardTitle>
                                <CardDescription className="text-xs">{turma.nome}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-slate-500">
                                        <span className="font-bold text-slate-900">{turma._count.matriculas}</span> alunos
                                    </div>
                                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-xs text-white" asChild>
                                        <Link href={`/turmas/${turma.id}`}>
                                            Abrir Diário
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}