"use client"

import { useState, useEffect } from "react"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, User, Hash } from "lucide-react"
import { toast } from "sonner"
import { salvarNotasAction } from "@/actions/notas"

interface EditGradeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: {
        matriculaId: string
        nome: string
        nota: number | null
    } | null
    etapa: string

    onSuccess: (novaNota: number) => void
}

export function EditGradeDialog({ open, onOpenChange, student, etapa, onSuccess }: EditGradeDialogProps) {
    const [valor, setValor] = useState<string>("")
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (student) {
            setValor(student.nota !== null ? student.nota.toString() : "")
        } else {
            setValor("")
        }
    }, [student])

    const handleSave = async () => {
        if (!student) return
        const numero = parseFloat(valor)

        if (valor !== "" && (isNaN(numero) || numero < 0 || numero > 10)) {
            toast.error("Nota inválida.")
            return
        }

        setIsSaving(true)
        try {
       
            const valorFinal = valor === "" ? 0 : numero

            const resultado = await salvarNotasAction({
                matriculaId: student.matriculaId,
                etapa: etapa,
                valor: valorFinal
            })

            if (resultado.success) {
                toast.success("Nota atualizada!")
            
                onSuccess(valorFinal)
                onOpenChange(false)
            } else {
                toast.error("Erro ao salvar: " + (resultado.erro || "Tente novamente."))
            }
        } catch (error) {
            toast.error("Erro de conexão.")
        } finally {
            setIsSaving(false)
        }
    }

    if (!student) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-6 rounded-2xl gap-6 bg-white border border-gray-100 shadow-xl">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900">Editar Nota</DialogTitle>
                            <DialogDescription className="text-gray-500 mt-1 flex items-center gap-2">
                                <span className="font-medium text-gray-700">{student.nome}</span>
                                <span className="text-gray-300">•</span>
                                <span>{etapa}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3">
                    <Label htmlFor="nota" className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                        Valor (0-10)
                    </Label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Hash className="w-5 h-5" /></div>
                        <Input
                            id="nota"
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            className="h-14 pl-12 text-lg font-semibold border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-500 rounded-xl"
                            placeholder="0.0"
                            autoFocus
                        />
                    </div>
                </div>

                <DialogFooter className="flex-row gap-3 sm:justify-end border-t border-gray-100 pt-5 mt-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving} className="flex-1 sm:flex-none h-12 rounded-xl">Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg">
                        {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}