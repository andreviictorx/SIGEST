"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"

interface StudentCardProps {
    nome: string
    matricula: string
    notaOriginal?: number
    notaRascunho?: number 
    isBulkMode: boolean 
    onDraftChange: (val: number) => void 
    onOpenIndividualEdit: () => void 
}

export function StudentCard({
    nome,
    matricula,
    notaOriginal,
    notaRascunho,
    isBulkMode,
    onDraftChange,
    onOpenIndividualEdit
}: StudentCardProps) {
    const displayValue = isBulkMode
        ? (notaRascunho ?? notaOriginal ?? "")
        : (notaOriginal)

    const hasNota = notaOriginal !== undefined && notaOriginal !== null
    const isAprovado = hasNota && (notaOriginal || 0) >= 6

    const statusColor = hasNota
        ? (isAprovado ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200")
        : "bg-gray-50 text-gray-400 border-gray-100"

    return (
        <div className={`
      flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 mb-3
      ${isBulkMode ? "bg-blue-50/30 border-blue-200 shadow-sm" : "bg-white border-gray-100 shadow-sm hover:shadow-md"}
    `}>

            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm bg-gray-50">
                    <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">
                        {nome.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-bold text-gray-800 text-base">{nome}</h3>
                    <p className="text-xs text-gray-400">Mat: {matricula}</p>
                </div>
            </div>

        
            <div className="flex items-center gap-4">

                {isBulkMode ? (
                 
                    <div className="w-24">
                        <Input
                            type="number"
                            step="0.1"
                            min={0}
                            max={10}
                            placeholder="-"
                            value={displayValue}
                            onChange={(e) => {
                                let val = parseFloat(e.target.value);
                                if (isNaN(val)) val = 0; 
                                if (val > 10) val = 10;
                                if (val < 0) val = 0;
                                onDraftChange(val);
                            }}
                            className="text-center font-bold text-lg h-12 bg-white border-blue-300 focus-visible:ring-blue-500"
                            autoFocus={false} 
                        />
                    </div>
                ) : (
                   
                    <>
                        <div className={`
                    flex items-center justify-center w-16 h-10 rounded-lg border font-bold text-lg
                    ${statusColor}
                `}>
                            {hasNota ? notaOriginal : "-"}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onOpenIndividualEdit}
                            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Corrigir Individualmente"
                        >
                            <Pencil className="w-5 h-5" />
                        </Button>
                    </>
                )}

            </div>
        </div>
    )
}