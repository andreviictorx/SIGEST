'use server'
import { prisma } from "@/lib/prisma";
import { professorSchema, ProfessorSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function criarProfessorAction(data: ProfessorSchema) {
  const result = professorSchema.safeParse(data);
  if (!result.success) {
    return { success: false, erro: "Dados invalidos no servidor" };
  }

  try {
    await prisma.professor.create({
      data: {
        nome: result.data.nome,
        email: result.data.email,
        matricula: result.data.matricula,
      },
    });

    revalidatePath("/professores");
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      erro: "Erro ao criar: Email ou Matrícula já existem.",
    };
  }
}

export async function alterarStatusProfessorAction(id: string, novoStatus: boolean) {
  try {
    await prisma.professor.update({
      where: { id },
      data: { ativo: novoStatus },
    });
    revalidatePath("/professores");
    return { sucesso: true };
  } catch (error) {
    console.error(error);
    return { sucesso: false, erro: "Erro ao inativar professor." };
  }
}
