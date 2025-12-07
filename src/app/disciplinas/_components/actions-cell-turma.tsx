'use client';

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2, Ban } from "lucide-react";
import { toast } from "sonner";
import { inativarAlunoAction } from "@/actions/alunos";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
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

export function ActionsCell({ aluno }: ActionsCellProps) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleInativar() {
        startTransition(async () => {
            const resultado = await inativarAlunoAction(aluno.id);

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

            {/* Botão Editar */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setIsAlertOpen(true)}
                            disabled={!aluno.ativo}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>


            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Inativar Aluno?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Você tem certeza que deseja inativar <strong>{aluno.nome}</strong>?
                            O aluno não aparecerá mais nas listas ativas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleInativar();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, inativar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}