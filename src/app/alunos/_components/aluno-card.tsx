import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { School, CreditCard } from "lucide-react";
import { ActionsCellAluno } from "./actions-cell-aluno";


interface AlunoCardProps {
    data: {
        id: string;
        nome: string;
        matricula: string;
        ativo: boolean;
        matriculas: {
            turma: {
                nome: string;
            };
        }[];
    };
}

export function AlunoCard({ data }: AlunoCardProps) {
    const iniciais = data.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
    const turmaAtual = data.matriculas[0]?.turma.nome || "Sem enturmação";
    const statusColor = data.ativo ? "bg-green-500" : "bg-red-500";
    const badgeStyle = data.ativo
        ? "bg-green-100 text-green-700 border-green-200"
        : "bg-red-100 text-red-700 border-red-200";

    return (
        <div className="group bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all flex items-center gap-4">

            <div className="relative shrink-0">
                <Avatar className="h-14 w-14 border-4 border-slate-50 shadow-inner">
                    <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xl">
                        {iniciais}
                    </AvatarFallback>
                </Avatar>
                <span className={`absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${statusColor}`} />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900 truncate leading-tight">
                        {data.nome}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeStyle}`}>
                        {data.ativo ? "Ativo" : "Inativo"}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <School className="h-3.5 w-3.5 text-blue-500" />
                        <span className="font-medium text-slate-700 truncate max-w-[120px]">
                            {turmaAtual}
                        </span>
                    </div>
                    <span className="hidden sm:block text-slate-300">|</span>
                    <div className="flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-mono text-xs">Mat: {data.matricula}</span>
                    </div>
                </div>
            </div>

            <div className="shrink-0">
                <ActionsCellAluno aluno={data} />
            </div>
        </div>
    );
}