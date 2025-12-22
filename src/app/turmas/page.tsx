import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { TurmasToolbar } from "./_components/turma-toolbar";
import { TurmaCard } from "./_components/turma-card";

type Props = {
    searchParams: Promise<{ q?: string, status?: string }>;
}

export default async function PageTurmas({ searchParams }: Props) {
    const session = await auth();
    if (!session) redirect("/login");

    const params = await searchParams;
    const query = params?.q || "";
    const statusFilter = (await searchParams)?.status || "todos";

    const whereCondition: any = {
        OR: query
            ? [
                { nome: { contains: query, mode: "insensitive" } },
                { codigo: { contains: query, mode: "insensitive" } },
            ]
            : undefined,
    };

    if (statusFilter === "ativos") whereCondition.ativo = true;
    if (statusFilter === "inativos") whereCondition.ativo = false;

    const [turmas, professores, disciplinas] = await Promise.all([
        prisma.turma.findMany({
            where: whereCondition,
            include: {
                professor: true,
                disciplina: true,
                _count: {select:{matriculas:true}}
            },
            orderBy: { nome: 'asc' }
        }),
        prisma.professor.findMany({ where: { ativo: true }, orderBy: { nome: 'asc' } }),
        prisma.disciplina.findMany({ orderBy: { nome: 'asc' } }),
    ]);
    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto">
            <TurmasToolbar professores={professores} disciplinas={disciplinas} />

            {turmas.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-4xl border border-slate-100 shadow-sm mt-4">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">Nenhuma turma encontrado</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">
                        Tente ajustar os filtros ou a busca por nome/matrícula.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-4">
                    {turmas.map((turma) => (
                        <TurmaCard key={turma.id} data={turma} />
                    ))}
                </div>
            )}
        </div>
    );
}