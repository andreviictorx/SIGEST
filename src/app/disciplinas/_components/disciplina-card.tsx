import { BookType, MoreHorizontal, School, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ActionsCellDisciplinas } from "./actions-cell-disciplina";

interface DisciplinaCardProps {
    data: {
        id: string;
        nome: string;
        codigo: string;
        cargaHoraria: number | null;
        ativo: boolean;
        _count: { turmas: number };
    };
}

export function DisciplinaCard({ data }: DisciplinaCardProps) {

    const isAtivo = data.ativo;
    const statusBg = isAtivo ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500";

    const borderClass = isAtivo ? "border-l-emerald-500" : "border-l-slate-300";
    const iconBg = isAtivo ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400";


    const cargaHorariaLabel = data.cargaHoraria ? `${data.cargaHoraria}h` : "N/A";

    return (
        <div className={`group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all ${borderClass} border-l-[6px]`}>
            <div className="p-5">
                <div className="flex items-start gap-4 mb-5">

                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${iconBg}`}>
                        <BookType className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                            <h3 className="text-lg font-bold text-slate-900 leading-tight truncate group-hover/link:text-emerald-600 transition-colors">
                                {data.nome}
                            </h3>
                            <p className="text-sm text-slate-500 font-mono mt-0.5">
                                Cód: {data.codigo}
                            </p>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                                <Clock className="h-3 w-3" />
                                <span>{cargaHorariaLabel}</span>
                            </div>
                        </div>
                    </div>


                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 ${statusBg}`}>
                        {isAtivo ? "Ativa" : "Inativa"}
                    </div>
                </div>

                <div className="h-px bg-slate-100 w-full mb-4" />


                <div className="flex items-center justify-between">

                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${isAtivo
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : "bg-slate-50 border-slate-100 text-slate-500"
                        }`}>
                        <School className="h-4 w-4" />
                        <span className="text-sm font-bold">{data._count.turmas}</span>
                        <span className="text-xs font-medium">Turmas vinculadas</span>
                    </div>
                    <ActionsCellDisciplinas disciplina={data} />
                </div>
            </div>
        </div>
    );
}