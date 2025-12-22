"use server";

import { prisma } from "@/lib/prisma";
import { disciplinaSchema, DisciplinaSchema } from "@/lib/schema";
import { buildSearchFilter } from "@/lib/search-filter";
import { revalidatePath } from "next/cache";


export async function criarDisciplinaAction(data: DisciplinaSchema) {
  const result = disciplinaSchema.safeParse(data);
  if (!result.success) {
    return { success: false, erro: "Dados invalidos no servidor" };
  }
  try {
    await prisma.disciplina.create({
      data: {
        nome: result.data.nome,
        codigo: result.data.codigo,
        cargaHoraria: result.data.cargaHoraria
      },
    });

    revalidatePath("/disciplinas");
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      erro: "Erro ao criar: Email ou Matrícula já existem.",
    };
  }
}


export async function alterarStatusDisciplinaAction(id: string, novoStatus: boolean) {
  try {
    await prisma.disciplina.update({
      where: { id },
      data: { ativo: novoStatus },
    });
    revalidatePath("/disciplinas");
    return { sucesso: true };
  } catch (error) {
    console.error(error);
    return { sucesso: false, erro: "Erro ao inativar disciplina." };
  }
}

export async function getDisiciplinas(query: string = "", status: string = "todos"){
   const whereCondition = buildSearchFilter(query, status, [
     "nome",
     "codigo",
   ]);
    const disciplinas = await prisma.disciplina.findMany({
      where: whereCondition,
      orderBy: { nome: "asc" },
      include: {
        _count: {
          select: { turmas: true },
        },
      },
    });
    return disciplinas
}
