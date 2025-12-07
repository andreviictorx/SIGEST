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

import { Avatar, AvatarFallback} from "@/components/ui/avatar";

import { SearchInput } from "@/components/searchInput";
import { ProfessorForm } from "./_components/professor-form";
import {ActionsCellProfessor } from "./_components/actions-cell-prof";


type Props = {
    searchParams: Promise<{ q?: string }>;
}

export default async function PageProfessores({ searchParams }: Props) {
    const session = await auth();
    if (!session) redirect("/login");

    const params = await searchParams;
    const query = params?.q || "";

    const professor = await prisma.professor.findMany({
        where: {
            OR: [
                { nome: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                { matricula: { contains: query } },
            ],
        },
        orderBy: { nome: 'asc' },
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
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Professores</h1>
                    <p className="text-slate-500">Gerencie os professores e suas informações.</p>
                </div>
                <div className="flex items-center gap-3">

                    <SearchInput placeholder="Buscar por nome, email..." />
                    <ProfessorForm/>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle>Listagem Geral</CardTitle>
                            <CardDescription>
                                Mostrando {professor.length} registros encontrados.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[300px] pl-6">Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Matricula</TableHead>
                                <TableHead className="text-right pr-6">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {professor.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                        Nenhuma disciplina encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                professor.map((prof) => (
                                    <TableRow key={prof.id} className="hover:bg-slate-50 group transition-colors">

                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10 border border-slate-200">

                                                    <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">
                                                        {getInitials(prof.nome)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                                        {prof.nome}
                                                    </span>

                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="font-mono text-slate-600">
                                            {prof.email}
                                        </TableCell>

                                        <TableCell className="font-mono text-slate-600">
                                            {prof.matricula}
                                        </TableCell>

                                        <TableCell>
                                           <ActionsCellProfessor
                                            professor={{
                                                id:prof.id,
                                                nome:prof.nome,
                                                ativo: prof.ativo
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