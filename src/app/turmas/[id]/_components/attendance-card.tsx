"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { StatusFrequencia } from "@prisma/client"
import { Check, X, FileText } from "lucide-react"

interface AttendanceCardProps {
    nome: string
    matricula: string
    percentual: number
    status: StatusFrequencia
    onChange: (novoStatus: StatusFrequencia) => void
}

export function AttendanceCard({
    nome,
    matricula,
    percentual,
    status,
    onChange
}: AttendanceCardProps) {

    const statusConfig = {
        PRESENTE: { border: "border-l-emerald-500", bg: "bg-white", activeBtn: "bg-emerald-600 text-white hover:bg-emerald-700" },
        AUSENTE: { border: "border-l-red-500", bg: "bg-red-50/50", activeBtn: "bg-red-600 text-white hover:bg-red-700" },
        JUSTIFICADO: { border: "border-l-yellow-400", bg: "bg-yellow-50/50", activeBtn: "bg-yellow-500 text-white hover:bg-yellow-600" },
    }

    const currentConfig = statusConfig[status]

    return (
        <div className={cn(
            "relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 transition-all",
            "border-l-[6px] shadow-sm", 
            currentConfig.border,
            currentConfig.bg
        )}>

            
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border border-gray-100"> 
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-bold">
                        {matricula.substring(0, 2)}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{nome}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                            percentual >= 85 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                percentual >= 75 ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                                    "bg-red-50 text-red-700 border-red-100"
                        )}>
                            {percentual}% Presença
                        </span>
                    </div>
                </div>
            </div>

          
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 w-full sm:w-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange("PRESENTE")}
                    className={cn("flex-1 sm:w-24 h-8 text-xs font-medium transition-all", status === "PRESENTE" ? statusConfig.PRESENTE.activeBtn : "text-gray-500 hover:text-emerald-600 hover:bg-white")}
                >
                    <Check className="w-3 h-3 mr-1.5" /> Presente
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange("AUSENTE")}
                    className={cn("flex-1 sm:w-24 h-8 text-xs font-medium transition-all", status === "AUSENTE" ? statusConfig.AUSENTE.activeBtn : "text-gray-500 hover:text-red-600 hover:bg-white")}
                >
                    <X className="w-3 h-3 mr-1.5" /> Ausente
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onChange("JUSTIFICADO")}
                    title="Justificar"
                    className={cn("w-8 h-8 rounded-md transition-all", status === "JUSTIFICADO" ? statusConfig.JUSTIFICADO.activeBtn : "text-gray-400 hover:text-yellow-600 hover:bg-white")}
                >
                    <FileText className="w-3 h-3" />
                </Button>
            </div>
        </div>
    )
}