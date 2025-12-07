'use client';

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2} from "lucide-react";
import { toast } from "sonner";
import { inativarProfessorAction } from "@/actions/professor";

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
import { error } from "console";

interface ActionsCellProps {
    professor: {
        id: string;
        nome: string;
        ativo: boolean;
    }
}

export function ActionsCellProfessor({ professor }: ActionsCellProps) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleInativar() {
        startTransition(async () => {
            const resultado = await inativarProfessorAction(professor.id);

            if (resultado.sucesso) {
                toast.success("Status do professor atualizado.");
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
                            disabled={!professor.ativo}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>


            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Inativar professor?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Você tem certeza que deseja inativar <strong>{professor.nome}</strong>?
                            O professor não aparecerá mais nas listas ativas.
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