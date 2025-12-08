"use server";

import { prisma } from "@/lib/prisma";
import { turmaSchema, TurmaSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

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

export async function alterarStatusTurmaAction(id: string, novoStatus: boolean) {
  try {
    await prisma.turma.update({
        where:{id},
        data: {ativo:novoStatus}
    })
    revalidatePath('/turmas')
    return { sucesso: true };
  } catch (error) {
    console.error(error);
    return { sucesso: false, erro: "Erro ao inativar turma." };
  }
}
