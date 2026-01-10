import { prisma } from "@/lib/prisma"
import { GradeManager } from "@/components/grade-manager"

async function getTurmasProfessor() {

    const turmas = await prisma.turma.findMany({
        where: {
            ativo: true
        },
        select: {
            id: true,
            nome: true,
            disciplina: {
                select: { nome: true }
            }
        },
        orderBy: { nome: 'asc' }
    })

    return turmas.map(t => ({
        id: t.id,
        nome: `${t.nome} - ${t.disciplina.nome}`
    }))
}

export default async function NotasPage() {
    const turmas = await getTurmasProfessor()

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Notas</h1>
                <p className="text-gray-500 mt-1">
                    Selecione a turma e a etapa para lançar as notas.
                </p>
            </div>

            <GradeManager turmasIniciais={turmas} />
        </div>
    )
}