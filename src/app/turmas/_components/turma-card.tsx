import { Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionsCellTurma } from "./actions-cell-turma";
import Link from "next/link"; 

interface TurmaCardProps {
    data: {
        id: string; 
        nome: string;
        codigo: string;
        ativo: boolean;
        disciplina: { nome: string };
        professor: { nome: string };
        _count: { matriculas: number };
    };
}

export function TurmaCard({ data }: TurmaCardProps) {
    const statusColor = data.ativo ? "text-green-700 bg-green-50" : "text-slate-500 bg-slate-100";
    const borderClass = data.ativo ? "border-l-amber-500" : "border-l-slate-300";

    return (
        <div className={`group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all ${borderClass} border-l-[6px]`}>
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <Link href={`/turmas/${data.id}`} className="block flex-1 cursor-pointer">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 group-hover:text-amber-500 transition-colors">
                            {data.disciplina.nome}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                            {data.nome}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-mono">
                            Cód: {data.codigo}
                        </p>
                    </Link>
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColor}`}>
                        {data.ativo ? "Ativa" : "Inativa"}
                    </div>
                </div>

         
                <div className="flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="bg-white p-1.5 rounded-full shadow-sm">
                        <GraduationCap className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate">
                        Prof. {data.professor.nome}
                    </span>
                </div>

                <div className="h-px bg-slate-100 w-full mb-4" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                        <Users className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-bold text-amber-900">{data._count.matriculas}</span>
                        <span className="text-xs text-amber-700 font-medium">alunos</span>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-400 hover:text-amber-600" asChild>
                            <Link href={`/turmas/${data.id}`}>Ver turma</Link>
                        </Button>

                        <ActionsCellTurma turma={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}