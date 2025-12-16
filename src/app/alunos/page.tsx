import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { AlunoCard } from "./_components/aluno-card";
import { AlunosToolbar } from "./_components/alunos-toolbar";


type Props = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function AlunosPage(props: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const searchParams = await props.searchParams;

  const query = searchParams?.q || "";
  const statusFilter = searchParams?.status || "todos";


  const whereCondition: any = {
    OR: query
      ? [
        { nome: { contains: query, mode: "insensitive" } },
        { matricula: { contains: query, mode: "insensitive" } },
      ]
      : undefined,
  };

  if (statusFilter === "ativos") {
    whereCondition.ativo = true;
  } else if (statusFilter === "inativos") {
    whereCondition.ativo = false;
  }


  const alunos = await prisma.aluno.findMany({
    where: whereCondition,
    orderBy: { nome: "asc" },
    include: {
      matriculas: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          turma: {
            select: { nome: true }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <AlunosToolbar />

      {alunos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-4xl border border-slate-100 shadow-sm mt-4">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-slate-900 font-bold text-lg">Nenhum aluno encontrado</h3>
          <p className="text-slate-500 max-w-xs mx-auto mt-2">
            Tente ajustar os filtros ou a busca por nome/matrícula.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-4">
          {alunos.map((aluno) => (
            <AlunoCard key={aluno.id} data={aluno} />
          ))}
        </div>
      )}
    </div>
  );
}