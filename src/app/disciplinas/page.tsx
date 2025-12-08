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

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { SearchInput } from "@/components/searchInput";
import { DisciplinaForm } from "./_components/disciplina-form";
import { ActionsCellDisciplinas } from "./_components/actions-cell-turma";
import { Badge } from "@/components/ui/badge";


type Props = {
    searchParams: Promise<{ q?: string }>;
}

export default async function PageDisciplinas({ searchParams }: Props) {
    const session = await auth();
    if (!session) redirect("/login");

    const params = await searchParams;
    const query = params?.q || "";

    const disciplinas = await prisma.disciplina.findMany({
        where: {
            OR: [
                {
                    nome: {
                        contains: query,
                        mode: "insensitive"
                    }
                },
                {
                    codigo: {
                        contains: query,
                        mode: "insensitive"
                    }
                }
            ]
        },
        orderBy: {
            nome: 'asc'
        },
    });


    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Disciplinas</h1>
                    <p className="text-slate-500">Gerencie as disciplinas e seus.</p>
                </div>
                <div className="flex items-center gap-3">

                    <SearchInput placeholder="Buscar por nome, email..." />
                    <DisciplinaForm />
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle>Listagem Geral</CardTitle>
                            <CardDescription>
                                Mostrando {disciplinas.length} registros encontrados.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[300px] pl-6">Disciplina</TableHead>
                                <TableHead>Codigo</TableHead>
                                <TableHead>Carga Horaria</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {disciplinas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                        Nenhuma disciplina encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                disciplinas.map((disciplina) => (
                                    <TableRow key={disciplina.id} className="hover:bg-slate-50 group transition-colors">
                                        {disciplina.ativo ? (
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10 border border-slate-200">

                                                        <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">
                                                            {getInitials(disciplina.nome)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                                            {disciplina.nome}
                                                        </span>

                                                    </div>
                                                </div>
                                            </TableCell>
                                        ) : (
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-4 opacity-80 line-through">
                                                    <Avatar className="h-10 w-10 border border-slate-200 opacity-80">

                                                        <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">
                                                            {getInitials(disciplina.nome)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col opacity-80">
                                                        <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                                            {disciplina.nome}
                                                        </span>

                                                    </div>
                                                </div>
                                            </TableCell>

                                        )}

                                        {disciplina.ativo ? (
                                            <TableCell className="font-mono text-slate-600">
                                                {disciplina.codigo}
                                            </TableCell>
                                        ) : (
                                            <TableCell className="font-mono text-slate-600 opacity-90 line-through">
                                                {disciplina.codigo}
                                            </TableCell>
                                        )}

                                        {disciplina.ativo ? (
                                            <TableCell className="font-mono text-slate-600">
                                                {disciplina.cargaHoraria}
                                            </TableCell>
                                        ) : (
                                            <TableCell className="font-mono text-slate-600 opacity-90 line-through">
                                                {disciplina.cargaHoraria}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <Badge
                                                variant={disciplina.ativo ? "default" : "secondary"}
                                                className={disciplina.ativo
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 shadow-none"
                                                }
                                            >
                                                {disciplina.ativo ? "Ativa" : "Encerrada"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <ActionsCellDisciplinas
                                                disciplina={{
                                                    id: disciplina.id,
                                                    nome: disciplina.nome,
                                                    ativo: disciplina.ativo
                                                }}
                                            />
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