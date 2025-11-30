"use server";

import { prisma } from "@/lib/prisma";
import { alunoSchema, AlunoSchema } from "@/lib/schema";
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

export async function inativarAlunoAction(id: string) {
  try {
    await prisma.aluno.update({
      where: { id },
      data: { ativo: false },
    });
    revalidatePath("/alunos");
    return { sucesso: true };
  } catch (error) {
    console.error(error);
    return { sucesso: false, erro: "Erro ao inativar aluno." };
  }
}
