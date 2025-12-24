"use server";
import { prisma } from "@/lib/prisma";
import { professorSchema, ProfessorSchema } from "@/lib/schema";
import { buildSearchFilter } from "@/lib/search-filter";
import { revalidatePath } from "next/cache";


export async function criarProfessorAction(data: ProfessorSchema) {
  const result = professorSchema.safeParse(data);
  if (!result.success) {
    return { success: false, erro: "data invalidos no servidor" };
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

export async function alterarDadosProfessoresAction(id:string, data: ProfessorSchema){
  const result = professorSchema.safeParse(data);
  if(!result.success){
    return {success: false, error: "Dados inválidos"}
  }

  try {
    await prisma.professor.update({
      where:{id},
      data:{
        nome: result.data.nome,
        email:result.data.email,
        matricula: result.data.matricula
      }
    })
    revalidatePath("/professores");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      erro: "Erro ao criar: Email ou Matrícula já existem.",
    };
  }
}

export async function alterarStatusProfessorAction(
  id: string,
  novoStatus: boolean
) {
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

export async function getProfessores(
  query: string = "",
  status: string = "todos"
) {
  const whereCondition = buildSearchFilter(query, status, [
    "nome",
    "matricula",
  ]);
  const professores = await prisma.professor.findMany({
    where: whereCondition,
    orderBy: { nome: "asc" },
    include: {
      turmas: {
        select: { nome: true },
      },
    },
  });
  return professores;
}
