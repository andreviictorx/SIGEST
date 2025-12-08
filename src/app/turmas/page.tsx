import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchInput } from "@/components/searchInput";
import { TurmaForm } from "./_components/turma-form";
import { ActionsCellTurma } from "./_components/actions-cell-turma";

type Props = {
    searchParams: Promise<{ q?: string }>;
}

export default async function PageTurmas({ searchParams }: Props) {
    const session = await auth();
    if (!session) redirect("/login");

    const params = await searchParams;
    const query = params?.q || "";

    const [turmas, professores, disciplinas] = await Promise.all([
        prisma.turma.findMany({
            where: { nome: { contains: query, mode: "insensitive" } },
            include: {
                professor: true,
                disciplina: true
            },
            orderBy: { nome: 'asc' }
        }),
        prisma.professor.findMany({ where: { ativo: true }, orderBy: { nome: 'asc' } }),
        prisma.disciplina.findMany({ orderBy: { nome: 'asc' } }),
    ]);

    const getInitials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

    return (
        <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestão de Turmas</h1>
                    <p className="text-slate-500">Controle de turmas, disciplinas e alocações.</p>
                </div>
                <div className="flex items-center gap-3">
                    <SearchInput placeholder="Buscar turma..." />
                    <TurmaForm professores={professores} disciplinas={disciplinas} />
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Grade Curricular Ativa
                            </CardTitle>
                            <CardDescription>
                                Listando {turmas.length} turmas.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[100px] pl-6">Código</TableHead>
                                <TableHead className="min-w-[150px]">Turma</TableHead>
                                <TableHead className="min-w-[150px]">Disciplina</TableHead>
                                <TableHead className="min-w-[200px]">Professor Responsável</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-10">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {turmas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                        Nenhuma turma encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                turmas.map((turma) => (
                                    <TableRow key={turma.id} className="hover:bg-slate-50 transition-colors">


                                        <TableCell className="pl-6 font-mono text-slate-600 font-medium">
                                            {turma.codigo}
                                        </TableCell>


                                        <TableCell className="font-semibold text-slate-900">
                                            {turma.nome}
                                        </TableCell>


                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {turma.disciplina.nome}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border border-slate-200">
                                                    <AvatarFallback className="bg-orange-50 text-orange-700 text-xs font-bold">
                                                        {getInitials(turma.professor.nome)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-slate-700 text-sm font-medium">
                                                    {turma.professor.nome}
                                                </span>
                                            </div>
                                        </TableCell>


                                        <TableCell>
                                            <Badge
                                                variant={turma.ativo ? "default" : "secondary"}
                                                className={turma.ativo
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 shadow-none"
                                                }
                                            >
                                                {turma.ativo ? "Aberta" : "Encerrada"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right pr-6">
                                            <span className="text-slate-400">
                                                <ActionsCellTurma
                                                    turma={{
                                                        id: turma.id,
                                                        nome: turma.nome,
                                                        ativo: turma.ativo
                                                    }}
                                                />

                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}