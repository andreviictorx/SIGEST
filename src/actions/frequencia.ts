"use server";

import { prisma } from "@/lib/prisma";
import { StatusFrequencia } from "@prisma/client";
import { revalidatePath } from "next/cache";

// o que precisamos receber
export interface AlunoFrequenciaDTO {
  matriculaId: string;
  nome: string;
  matricula: string; 
  statusHoje: StatusFrequencia | null; 
  metricas: {
    totalAulas: number;
    totalPresencas: number;
    percentual: number;
  };
}

/**
 * Busca a lista de chamada inteligente.
 * @param turmaId ID da turma
 * @param dataString Data no formato ISO YYYY-MM-DD
 */


export async function getDiarioFrequencia(
  turmaId: string,
  dataString: string
): Promise<AlunoFrequenciaDTO[]> {
  const dataReferencia = new Date(`${dataString}T12:00:00Z`);

  try {
    const alunos = await prisma.matricula.findMany({
      where: { turmaId },
      orderBy: { aluno: { nome: "asc" } },
      include: {
        aluno: true,
        frequencia: {
          where: {
            data: {
              gte: new Date(`${dataString}T00:00:00Z`),
              lt: new Date(`${dataString}T23:59:59Z`),
            },
          },
        },
          //Aqui buscamos os alunos que fazem parte da turmaX(turmaID),trazendo todos os dados desse aluno e a frequencia busca apenas os dados do dia atual,evitando outrso dias
        _count: {
          select: { frequencia: true },
        },

        // pegamos quantas frequencias o aluno em questao ja tem 
      },
    });

    const presencasAgrupadas = await prisma.frequencia.groupBy({
      by: ["matriculaId"],
      where: {
        matricula: { turmaId },
        status: { in: ["PRESENTE", "JUSTIFICADO"] },
      },
      _count: true,
    });
    // busca as presencas separados por alunos, complementando a query de cima

    const mapaPresencas = new Map(
      presencasAgrupadas.map((p) => [p.matriculaId, p._count])
    );

    // um hash map para facil acesso de acordo com o id do aluno em questao, guardando a quantidade de frequencias que ele possui

    
    return alunos.map((matricula) => {
      const presencas = mapaPresencas.get(matricula.id) || 0
    //   vai ate o map e verifica se há alguem com o id em questao e traz a quantidade de presença que ele possui
      const totalAulas = matricula._count.frequencia;
      const percentual =
        totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 100;
        //  a gente padroniza para sempre ter 100% de presença, com o total de aulas que ja teve no ano 
      return {
        matriculaId: matricula.id,
        nome: matricula.aluno.nome,
        matricula: matricula.aluno.matricula,
        statusHoje: matricula.frequencia[0]?.status ?? null,
        metricas: {
          totalAulas,
          totalPresencas: presencas,
          percentual,
        },
      };
    });
  } catch (error) {
    console.error("Erro ao buscar diário de frequência:", error);
    return [];
  }
}


export async function salvarFrequenciaEmMassaAction(
  payload: { matriculaId: string; status: StatusFrequencia }[],
  turmaId: string,
  dataString: string
) {
  // Normaliza a data para garantir consistência (Meio-dia UTC)
  const dataAlvo = new Date(`${dataString}T12:00:00Z`);

  try {
    await prisma.$transaction(
      payload.map((item) =>
        prisma.frequencia.upsert({
          where: {
            matriculaId_data: {
              matriculaId: item.matriculaId,
              data: dataAlvo,
            },
          },
          update: {
            status: item.status,
          },
          create: {
            matriculaId: item.matriculaId,
            data: dataAlvo,
            status: item.status,
          },
        })
      )
    );

    // aqui a gente usa o transaction para: Ou envia tudo, ou cancela tudo; Em caso desconexão, sistema cair, etc
    // o upsert serve para facilitar a troca entre o status, pois os alunos podem chegar tarde

    revalidatePath(`/turmas/${turmaId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar frequência:", error);
    return { success: false, erro: "Falha ao registrar chamada." };
  }
}
