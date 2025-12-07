"use server";

import { prisma } from "@/lib/prisma";
import { disciplinaSchema, DisciplinaSchema } from "@/lib/schema";
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
