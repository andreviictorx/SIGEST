import { prisma } from "@/lib/prisma";

export async function getAdminDashboardMetrics() {
  const [
    quantidadeTotalAlunos,
    quantidadeTotalProfessores,
    quantidadeTurmasAtivas,
    matriculasRecentes
  ] = await Promise.all([
    prisma.aluno.count({ where: { ativo: true } }),
    prisma.professor.count({ where: { ativo: true } }),
    prisma.turma.count({ where: { ativo: true } }),
    prisma.matricula.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        aluno: { select: { nome: true } },
        turma: {
          select: {
            nome: true,
            disciplina: { select: { nome: true } }
          }
        }
      }
    })
  ]);

  return {
    quantidadeTotalAlunos,
    quantidadeTotalProfessores,
    quantidadeTurmasAtivas,
    matriculasRecentes
  };
}