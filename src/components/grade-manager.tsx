"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Loader2, Users, ListChecks, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StudentCard } from "./student-card"
import { GradeFilters } from "./grade-filter"
import { EditGradeDialog } from "./edit-grade-dialog"
import { getDiarioClasse, AlunoComNota, salvarNotasEmMassaAction } from "@/actions/notas"
import { salvarNotasAction } from "@/actions/notas"

const ETAPAS = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre", "Recuperação"]

interface GradeManagerProps {
    turmasIniciais: { id: string; nome: string }[]
}

export function GradeManager({ turmasIniciais }: GradeManagerProps) {

    const [turmaId, setTurmaId] = useState<string>("")
    const [etapa, setEtapa] = useState<string>(ETAPAS[0])
    const [alunos, setAlunos] = useState<AlunoComNota[]>([])
    const [draftGrades, setDraftGrades] = useState<Record<string, number>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isBulkMode, setIsBulkMode] = useState(false)
    const [editingStudent, setEditingStudent] = useState<{ matriculaId: string, nome: string, nota: number | null } | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const fetchDiario = useCallback(async () => {
        if (!turmaId) return
        setIsLoading(true)
        setDraftGrades({})
        try {
            const dados = await getDiarioClasse(turmaId, etapa)
            setAlunos(dados)
        } catch (error) {
            toast.error("Erro ao carregar lista")
        } finally {
            setIsLoading(false)
        }
    }, [turmaId, etapa])

    useEffect(() => {
        fetchDiario()
        setIsBulkMode(false)
    }, [fetchDiario])

    const handleDialogSuccess = (novaNota: number) => {
        setAlunos((listaAtual) =>
            listaAtual.map((aluno) =>
                aluno.matriculaId === editingStudent?.matriculaId
                    ? { ...aluno, nota: novaNota }
                    : aluno
            )
        )
    }

    const handleDraftChange = (matriculaId: string, valor: number) => {
        setDraftGrades(prev => ({ ...prev, [matriculaId]: valor }))
    }

    const handleBulkSave = async () => {
        const idsParaSalvar = Object.keys(draftGrades);
        if (idsParaSalvar.length === 0) {
            setIsBulkMode(false);
            return;
        }

        setIsSaving(true)

        try {

            const payload = idsParaSalvar.map(matriculaId => ({
                matriculaId: matriculaId,
                valor: draftGrades[matriculaId]
            }))

            const resultado = await salvarNotasEmMassaAction(payload, etapa)

            if (!resultado.success) {
                throw new Error(resultado.erro || "Erro desconhecido")
            }

            toast.success("Notas lançadas com sucesso!")

            setAlunos(prev => prev.map(a =>
                draftGrades[a.matriculaId] !== undefined
                    ? { ...a, nota: draftGrades[a.matriculaId] }
                    : a
            ))

            setDraftGrades({})
            setIsBulkMode(false)

        } catch (error) {
            console.error(error)
            toast.error("Erro ao salvar lote. Nenhuma alteração foi feita.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 pb-20">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1 w-full">
                    <GradeFilters
                        turmas={turmasIniciais}
                        selectedTurma={turmaId}
                        onSelectTurma={setTurmaId}
                        etapas={ETAPAS}
                        selectedEtapa={etapa}
                        onSelectEtapa={setEtapa}
                    />
                </div>

                {turmaId && (
                    <div className="w-full md:w-auto flex flex-col justify-end pb-0.5">
                        {isBulkMode ? (
                            <div className="flex items-center gap-2 animate-in slide-in-from-right-5 fade-in duration-300">

                                <Button
                                    variant="ghost"
                                    className="h-10 px-4 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    onClick={() => { setDraftGrades({}); setIsBulkMode(false) }}
                                    disabled={isSaving}
                                >
                                    Cancelar
                                </Button>


                                <Button
                                    size="default"
                                    className="h-10 px-6 font-medium bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all"
                                    onClick={handleBulkSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="mr-2 h-4 w-4" />
                                    )}
                                    Confirmar Lançamentos
                                </Button>
                            </div>
                        ) : (

                            <Button
                                size="default"
                                className="w-full md:w-auto h-10 px-6 font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
                                onClick={() => setIsBulkMode(true)}
                                disabled={isLoading}
                            >
                                <ListChecks className="mr-2 h-4 w-4" />
                                Lançamento Rápido
                            </Button>
                        )}
                    </div>
                )}
            </div>


            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px] transition-all duration-300 ${isBulkMode ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}>
                <div className={`border-b px-6 py-4 flex items-center justify-between transition-colors duration-300 ${isBulkMode ? "bg-blue-50 border-blue-100" : "bg-white border-gray-100"}`}>
                    <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isBulkMode ? "text-blue-700" : "text-gray-600"}`}>
                        <Users className="w-4 h-4" />
                        {isBulkMode ? "Modo de Edição em Massa" : "Diário de Classe"}
                    </h2>
                    {isBulkMode && (
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                            Editando notas
                        </span>
                    )}
                </div>

                <div className="p-4 space-y-3">
                    {isLoading ? (
                        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
                    ) : alunos.length === 0 && turmaId ? (
                        <div className="text-center py-20 text-gray-400">Nenhum aluno encontrado.</div>
                    ) : !turmaId ? (
                        <div className="text-center py-20 text-gray-400">Selecione uma turma.</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {alunos.map((aluno) => (
                                <StudentCard
                                    key={aluno.matriculaId}
                                    nome={aluno.nome}
                                    matricula={aluno.codigoMatricula}
                                    notaOriginal={aluno.nota ?? undefined}
                                    notaRascunho={draftGrades[aluno.matriculaId]}
                                    isBulkMode={isBulkMode}
                                    onDraftChange={(val) => handleDraftChange(aluno.matriculaId, val)}
                                    onOpenIndividualEdit={() => {
                                        setEditingStudent({ matriculaId: aluno.matriculaId, nome: aluno.nome, nota: aluno.nota })
                                        setIsDialogOpen(true)
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <EditGradeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                student={editingStudent}
                etapa={etapa}
                onSuccess={handleDialogSuccess}
            />
        </div>
    )
}