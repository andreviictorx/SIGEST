'use client';

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { alterarStatusAlunoAction } from "@/actions/alunos";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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

interface ActionsCellProps {
    aluno: {
        id: string;
        nome: string;
        ativo: boolean; 
    }
}

export function ActionsCellAluno({ aluno }: ActionsCellProps) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const novoStatus = !aluno.ativo;
    const acaoTexto = aluno.ativo ? "Inativar" : "Reativar";
    const corBotao = aluno.ativo ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50";
    const corConfirmacao = aluno.ativo ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700";

    function handleStatusChange() {
        startTransition(async () => {
            const resultado = await alterarStatusAlunoAction(aluno.id, novoStatus);

            if (resultado.sucesso) {
                toast.success("Status do aluno atualizado.");
                setIsAlertOpen(false);
            } else {
                toast.error("Erro ao atualizar status.");
            }
        });
    }

    return (
        <div className="flex items-center justify-end gap-2">


            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                            onClick={() => toast.info("Edição em breve...")}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>


            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${corBotao} cursor-pointer`}
                            onClick={() => setIsAlertOpen(true)}
                        >
                            {aluno.ativo ? (
                                <Trash2 className="h-4 w-4" />
                            ) : (
                                <RefreshCcw className="h-4 w-4" />
                            )}
                        </Button>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>


            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{acaoTexto} aluno?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {aluno.ativo
                                ? `Você tem certeza que deseja inativar ${aluno.nome}? Ela não aparecerá mais nas listas ativas.`
                                : `Você deseja reativar o cadastro de ${aluno.nome}? Ela voltará a aparecer nas listas.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleStatusChange();
                            }}
                            className={`${corConfirmacao} text-white cursor-pointer`}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : `Sim, ${acaoTexto.toLowerCase()}`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}