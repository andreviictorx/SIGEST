"use client"

import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { Calendar as CalendarIcon, Save, Users, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AttendanceCard } from "./attendance-card"
import { getDiarioFrequencia, salvarFrequenciaEmMassaAction, AlunoFrequenciaDTO } from "@/actions/frequencia"
import { StatusFrequencia } from "@prisma/client"

interface AttendanceManagerProps {
    turmaId: string
    nomeTurma: string
}

export function AttendanceManager({ turmaId }: AttendanceManagerProps) {
    const [dataSelecionada, setDataSelecionada] = useState<string>(new Date().toISOString().split('T')[0])
    const [alunos, setAlunos] = useState<AlunoFrequenciaDTO[]>([])
    const [draft, setDraft] = useState<Record<string, StatusFrequencia>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

   
    useEffect(() => {
        let isMounted = true
        const fetchDados = async () => {
            setIsLoading(true)
           
            setDraft({})
            try {
                const dados = await getDiarioFrequencia(turmaId, dataSelecionada)
                if (isMounted) setAlunos(dados)
            } catch (error) {
                toast.error("Não foi possível carregar a lista de presença.")
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }
        fetchDados()
        return () => { isMounted = false }
    }, [turmaId, dataSelecionada])

   
    const getStatus = (aluno: AlunoFrequenciaDTO) => {
        return draft[aluno.matriculaId] ?? aluno.statusHoje ?? "PRESENTE"
    }

    const hasChanges = Object.keys(draft).length > 0

    const stats = useMemo(() => {
        let presentes = 0
        let ausentes = 0
        alunos.forEach(aluno => {
            const status = getStatus(aluno)
            if (status === "PRESENTE" || status === "JUSTIFICADO") presentes++
            if (status === "AUSENTE") ausentes++
        })
        return { presentes, ausentes }
    }, [alunos, draft])

    
    const handleSave = async () => {
        if (!hasChanges) return
        setIsSaving(true)
        try {
            const payload = alunos.map(aluno => ({
                matriculaId: aluno.matriculaId,
                status: getStatus(aluno)
            }))
            // pega so os dados necesarios, matricula do aluno e o status
            const resultado = await salvarFrequenciaEmMassaAction(payload, turmaId, dataSelecionada)

            if (!resultado.success) throw new Error(resultado.erro)

            toast.success("Frequência salva com sucesso!", {
                description: `${stats.presentes} presentes, ${stats.ausentes} ausentes.`
            })

            setAlunos(prev => prev.map(a => ({ ...a, statusHoje: getStatus(a) })))
            setDraft({}) 
            // atualiza o status que antes estava como "rascunho" de maneira permanente no banco

        } catch (error) {
            toast.error("Erro ao salvar. Tente novamente.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleMarcarTodos = (status: StatusFrequencia) => {
        const novoDraft: Record<string, StatusFrequencia> = {}
        alunos.forEach(a => novoDraft[a.matriculaId] = status)
        setDraft(novoDraft)
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">

    
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg ml-1">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Data da Chamada</p>
                        <input
                            type="date"
                            value={dataSelecionada}
                            onChange={(e) => setDataSelecionada(e.target.value)}
                            className="w-full text-sm font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer h-6"
                        />
                    </div>
                    {hasChanges && (
                        <div className="mr-3 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            Não salvo
                        </div>
                    )}
                </div>

                
                <Button
                    size="default" 
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className={`h-10 px-6 font-medium transition-all ${hasChanges
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
                            : "bg-gray-100 text-gray-400 border border-gray-200"
                        }`}
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {hasChanges ? "Confirmar Chamada" : "Tudo Atualizado"}
                </Button>
            </div>

           
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Presentes</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.presentes}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Ausentes</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.ausentes}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Alunos ({alunos.length})
                    </h3>
                    {alunos.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarcarTodos("PRESENTE")}
                            className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            Resetar para Todos Presentes
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-sm">Carregando diário...</p>
                    </div>
                ) : alunos.length === 0 ? (
           
                    <div className="py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">Nenhum aluno encontrado nesta turma.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {alunos.map((aluno) => (
                            <AttendanceCard
                                key={aluno.matriculaId}
                                nome={aluno.nome}
                                matricula={aluno.matricula}
                                percentual={aluno.metricas.percentual}
                                status={getStatus(aluno)}
                                onChange={(status) => setDraft(prev => ({ ...prev, [aluno.matriculaId]: status }))}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}