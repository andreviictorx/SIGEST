"use server";

import { prisma } from "@/lib/prisma";
import { alunoSchema, AlunoSchema } from "@/lib/schema";
import { buildSearchFilter } from "@/lib/search-filter";
import { revalidatePath } from "next/cache";

export async function criarAlunoAction(data: AlunoSchema) {
  const result = alunoSchema.safeParse(data);
  if (!result.success) {
    return { success: false, erro: "Dados invalidos no servidor" };
  }
  try {
    await prisma.aluno.create({
      data: {
        nome: result.data.nome,
        email: result.data.email,
        matricula: result.data.matricula,
        telefone: result.data.telefone,
      },
    });

    revalidatePath("/alunos");

    return { sucesso: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      erro: "Erro ao criar: Email ou Matrícula já existem.",
    };
  }
}

export async function atualizarAlunoAction(id: string, data: AlunoSchema) {
  const result = alunoSchema.safeParse(data);
  if (!result.success) {
    return { success: false, erro: "Dados invalidos no servidor" };
  }
  try {
    await prisma.aluno.update({
      where: { id },
      data: {
        nome: result.data.nome,
        email: result.data.email,
        matricula: result.data.matricula,
      },
    });
    revalidatePath("/alunos")
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      erro: "Erro ao criar: Email ou Matrícula já existem.",
    };
  }
}

export async function alterarStatusAlunoAction(
  id: string,
  novoStatus: boolean
) {
  try {
    await prisma.aluno.update({
      where: { id },
      data: { ativo: novoStatus },
    });
    revalidatePath("/alunos");
    return { sucesso: true };
  } catch (error) {
    console.error(error);
    return { sucesso: false, erro: "Erro ao inativar aluno." };
  }
}

export async function getAlunos(query: string = "", status: string = "todos") {
  const whereCondition = buildSearchFilter(query, status, [
    "nome",
    "matricula",
  ]);

  const alunos = await prisma.aluno.findMany({
    where: whereCondition,
    orderBy: { nome: "asc" },
    include: {
      matriculas: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          turma: {
            select: { nome: true },
          },
        },
      },
    },
  });
  return alunos;
}
