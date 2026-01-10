"use server";

import { prisma } from "@/lib/prisma";
import { notasSchema, NotasSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function salvarNotasAction(notas: NotasSchema) {
  const result = notasSchema.safeParse(notas);
  if (!result.success) {
   console.error("Erro de validação ZOD:", result.error.format());

   // Isso vai devolver o erro detalhado para a tela
   return {
     success: false,
     erro:
       "Erro de validação: " +
       JSON.stringify(result.error.flatten().fieldErrors),
   };
  }
  const data = result.data;
  try {
    await prisma.nota.upsert({
      where: {
        matriculaId_etapa: {
          matriculaId: data.matriculaId,
          etapa: data.etapa,
        },
      },
      create: {
        matriculaId: data.matriculaId,
        etapa: data.etapa,
        valor: data.valor,
      },
      update: {
        valor: data.valor,
      },
    });
    revalidatePath("/notas");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      erro: "Erro ao criar: Os dados da nota não concidem.",
    };
  }
}
// ---------------------------------

export interface AlunoComNota {
  matriculaId: string;
  alunoId: string;
  nome: string;
  codigoMatricula: string; 
  nota: number | null; 
}

export async function getDiarioClasse(turmaId: string,etapa: string)
:Promise<AlunoComNota[]>
{
  if (!turmaId || !etapa) return [];

  try {
    const dados = await prisma.turma.findUnique({
      where: { id: turmaId },
      include: {
        matriculas: {
          orderBy: {
            aluno: {
              nome: "asc",
            },
          },
          include: {
            aluno: true, 
            notas: {
              where: {
                etapa: etapa,
              },
            },
          },
        },
      },
    });

    if (!dados) return [];

    const diarioFormatado = dados.matriculas.map((matricula) => {
      const notaLancada = matricula.notas[0]?.valor;
      return {
        matriculaId: matricula.id, 
        alunoId: matricula.aluno.id,
        nome: matricula.aluno.nome,
        codigoMatricula: matricula.aluno.matricula,
        nota: notaLancada !== undefined ? notaLancada : null,
      };
    });

    return diarioFormatado;
  } catch (error) {
    console.error("Erro ao buscar diário:", error);
    return [];
  }
}

interface NotaLancamentoEmMassa {
  matriculaId: string;
  valor: number;
}

export async function salvarNotasEmMassaAction(
  notas: NotaLancamentoEmMassa[],
  etapa: string
) {
  if (!notas || notas.length === 0)
    return { success: false, erro: "Nenhuma nota para salvar." };

  try {
    // A transação garante que todas as operações rodem juntas no banco
    await prisma.$transaction(
      notas.map((nota) =>
        prisma.nota.upsert({
          where: {
            matriculaId_etapa: {
              matriculaId: nota.matriculaId,
              etapa: etapa,
            },
          },
          update: {
            valor: nota.valor,
          },
          create: {
            matriculaId: nota.matriculaId,
            etapa: etapa,
            valor: nota.valor,
          },
        })
      )
    );

    // Revalida o cache para atualizar a interface
    revalidatePath("/notas");

    return { success: true };
  } catch (error) {
    console.error("Erro no salvamento em massa:", error);
    // Em produção, você pode logar o erro real mas retornar uma mensagem amigável
    return {
      success: false,
      erro: "Falha ao salvar lote de notas. Tente novamente.",
    };
  }
}