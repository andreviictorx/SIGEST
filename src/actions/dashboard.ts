"use server";

import { prisma } from "@/lib/prisma";

export interface ChartData {
  nome: string;
  notaMedia: number;
  frequenciaMedia: number;
  totalAlunos: number;
}

export async function getAdminDashboardMetrics() {
  const [
    totalAlunos,
    totalProfessores,
    totalTurmas,
    matriculasRecentes,
    turmasDetalhadas,
  ] = await Promise.all([
    prisma.aluno.count({ where: { ativo: true } }),
    prisma.professor.count({ where: { ativo: true } }),
    prisma.turma.count({ where: { ativo: true } }),
    prisma.matricula.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        aluno: { select: { nome: true } },
        turma: { include: { disciplina: { select: { nome: true } } } },
      },
    }),
    prisma.turma.findMany({
      where: { ativo: true },
      take: 7,
      include: {
        disciplina: { select: { nome: true } },
        matriculas: {
          include: {
            notas: { select: { valor: true } },
            frequencia: { select: { status: true } },
          },
        },
      },
    }),
  ]);

  const graficoDesempenho: ChartData[] = turmasDetalhadas.map((turma) => {
    let somaNotas = 0;
    let qtdNotas = 0;
    let totalAulasComputadas = 0;
    let totalPresencas = 0;

    turma.matriculas.forEach((matr) => {
      matr.notas.forEach((n) => {
        somaNotas += Number(n.valor);
        qtdNotas++;
      });
      matr.frequencia.forEach((f) => {
        totalAulasComputadas++;
        if (f.status === "PRESENTE" || f.status === "JUSTIFICADO")
          totalPresencas++;
      });
    });

    return {
      nome: turma.disciplina.nome,
      notaMedia: qtdNotas > 0 ? Number((somaNotas / qtdNotas).toFixed(1)) : 0,
      frequenciaMedia:
        totalAulasComputadas > 0
          ? Math.round((totalPresencas / totalAulasComputadas) * 100)
          : 100,
      totalAlunos: turma.matriculas.length,
    };
  });

  return {
    quantidadeTotalAlunos: totalAlunos,
    quantidadeTotalProfessores: totalProfessores,
    quantidadeTurmasAtivas: totalTurmas,
    matriculasRecentes,
    graficoDesempenho,
  };
}


export async function getProfessorDashboardData(email: string) {
  const professor = await prisma.professor.findUnique({
    where: { email },
    select: {
      id: true,
      nome: true,
      turmas: {
        where: { ativo: true },
        orderBy: { disciplina: { nome: "asc" } }, 
        include: {
          disciplina: true,
          _count: { select: { matriculas: true } },
        },
      },
    },
  });

  if (!professor) {
    return null;
  }


  const totalTurmas = professor.turmas.length;
  const totalAlunos = professor.turmas.reduce(
    (acc, t) => acc + t._count.matriculas,
    0
  );


  return {
    professor,
    turmas: professor.turmas,
    stats: {
      totalTurmas,
      totalAlunos,
    },
  };
}