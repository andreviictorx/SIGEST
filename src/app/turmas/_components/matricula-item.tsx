'use client';

import { useState, useTransition } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { removerMatriculaAction } from "@/actions/turma";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MatriculaItemProps {
    matricula: {
        id: string;
        turmaId: string;
        createdAt: Date;
        aluno: {
            nome: string;
            matricula: string;
        };
    };
}

export function MatriculaItem({ matricula }: MatriculaItemProps) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const getInitials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

    function handleRemove() {
        startTransition(async () => {
            const res = await removerMatriculaAction(matricula.id, matricula.turmaId);
            if (res.sucesso) {
                toast.success("Aluno removido da turma.");
            } else {
                toast.error("Erro ao remover.");
            }
            setIsAlertOpen(false);
        });
    }

    return (
        <>
            <li className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-0">

               
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-slate-200">
                        <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-bold">
                            {getInitials(matricula.aluno.nome)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                            {matricula.aluno.nome}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                            {matricula.aluno.matricula}
                        </span>
                    </div>
                </div>

           
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {matricula.createdAt.toLocaleDateString('pt-BR')}
                    </span>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                        onClick={() => setIsAlertOpen(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </li>

            
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover aluno da turma?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Isso removerá <strong>{matricula.aluno.nome}</strong> desta turma.
                            O cadastro do aluno no sistema permanecerá intacto.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); handleRemove(); }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, remover"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}