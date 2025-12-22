"use server";

import { prisma } from "@/lib/prisma";
import { turmaSchema, TurmaSchema } from "@/lib/schema";
import { buildSearchFilter } from "@/lib/search-filter";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { success } from "zod";

export async function criarTurmaAction(data: TurmaSchema) {
  const result = turmaSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Erro ao cadastrar a turma" };
  }
  try {
    await prisma.turma.create({
      data: {
        nome: result.data.nome,
        codigo: result.data.codigo,
        professorId: result.data.professorId,
        disciplinaId: result.data.disciplinaId,
      },
    });
    revalidatePath("/turmas");
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      erro: "Erro ao criar: Email ou Matrícula já existem.",
    };
  }
}

export async function alterarStatusTurmaAction(
  id: string,
  novoStatus: boolean
) {
  try {
    await prisma.turma.update({
      where: { id },
      data: { ativo: novoStatus },
    });
    revalidatePath("/turmas");
    return { sucesso: true };
  } catch (error) {
    console.error(error);
    return { sucesso: false, erro: "Erro ao inativar turma." };
  }
}

export async function matricularAlunoAction(turmaId: string, alunoId: string) {
  if (!turmaId || !alunoId) {
    return {
      sucesso: false,
      erro: "Essas informações não existem no nosso sistema",
    };
  }
  try {
    await prisma.matricula.create({
      data: {
        alunoId: alunoId,
        turmaId: turmaId,
      },
    });

    revalidatePath(`/turmas/${turmaId}`);
    return { sucesso: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
 
      if (error.code === "P2002") {
        return {
          sucesso: false,
          erro: "Este aluno já está matriculado nesta turma.",
        };
      }
    }

    console.error(error); 
    return { sucesso: false, erro: "Erro interno ao processar matrícula." };
  }
}



export async function removerMatriculaAction(matriculaId: string, turmaId: string) {
  try {
    await prisma.matricula.delete({
      where: { id: matriculaId },
    });
    revalidatePath(`/turmas/${turmaId}`);
    return { sucesso: true };
  } catch (error) {
    console.error(error);
    return { sucesso: false, erro: "Erro ao remover matrícula." };
  }
}

export async function getTurmas(query: string = "", status: string = "todos"){
   const whereCondition = buildSearchFilter(query, status, [
     "nome",
     "codigo",
   ]);
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

    return {
      turmas,
      professores,
      disciplinas
    }
}