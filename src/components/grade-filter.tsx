"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CalendarClock, School } from "lucide-react";

interface GradeFiltersProps {
    turmas: { id: string; nome: string }[]
    selectedTurma: string
    onSelectTurma: (id: string) => void
    etapas: string[]
    selectedEtapa: string
    onSelectEtapa: (etapa: string) => void
}

export function GradeFilters({
    turmas,
    selectedTurma,
    onSelectTurma,
    etapas,
    selectedEtapa,
    onSelectEtapa
}: GradeFiltersProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* === SELETOR DE TURMA === */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                        Turma & Disciplina
                    </label>
                    <Select value={selectedTurma} onValueChange={onSelectTurma}>
                        <SelectTrigger className="h-14 pl-4 pr-4 bg-gray-50/50 border-2 border-gray-100 hover:border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl text-base group">
                            <div className="flex items-center gap-3 text-gray-700 group-hover:text-blue-700 transition-colors">
                                {/* Ícone com fundo sutil */}
                                <div className="p-1.5 bg-white rounded-md shadow-sm text-gray-400 group-hover:text-blue-600 transition-colors">
                                    <School className="w-5 h-5" />
                                </div>
                                <SelectValue placeholder="Selecione a turma..." />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                            {turmas.map((t) => (
                                <SelectItem key={t.id} value={t.id} className="py-3 px-4 cursor-pointer focus:bg-blue-50 focus:text-blue-700 text-base">
                                    {t.nome}
                                </SelectItem>
                            ))}   
                        </SelectContent>
                    </Select>
                </div>

                {/* === SELETOR DE ETAPA === */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                        Período Avaliativo
                    </label>
                    <Select value={selectedEtapa} onValueChange={onSelectEtapa}>
                        <SelectTrigger className="h-14 pl-4 pr-4 bg-gray-50/50 border-2 border-gray-100 hover:border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl text-base group">
                            <div className="flex items-center gap-3 text-gray-700 group-hover:text-blue-700 transition-colors">
                                <div className="p-1.5 bg-white rounded-md shadow-sm text-gray-400 group-hover:text-blue-600 transition-colors">
                                    <CalendarClock className="w-5 h-5" />
                                </div>
                                <SelectValue placeholder="Selecione a etapa..." />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                            {etapas.map((etapa) => (
                                <SelectItem key={etapa} value={etapa} className="py-3 px-4 cursor-pointer focus:bg-blue-50 focus:text-blue-700 text-base">
                                    {etapa}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>
        </div>
    )
}