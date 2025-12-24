'use client';

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { alterarStatusProfessorAction } from "@/actions/professor";

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
import { ProfessorForm } from "./professor-form";

interface ActionsCellProps {
    professor: {
        id: string;
        nome: string;
        email:string,
        matricula:string
        ativo: boolean;
    }
}

export function ActionsCellProfessor({ professor }: ActionsCellProps) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isPending, startTransition] = useTransition();


    const novoStatus = !professor.ativo;
    const acaoTexto = professor.ativo ? "Inativar" : "Reativar";
    const corBotao = professor.ativo ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50";
    const corConfirmacao = professor.ativo ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700";

    function handleStatusChange() {
        startTransition(async () => {
            const resultado = await alterarStatusProfessorAction(professor.id, novoStatus);

            if (resultado.sucesso) {
                toast.success(`Professor ${acaoTexto.toLowerCase()} com sucesso.`);
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
                       <ProfessorForm professorData={professor} />
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
                            {professor.ativo ? (
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
                        <AlertDialogTitle>{acaoTexto} Professor?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {professor.ativo
                                ? `Você tem certeza que deseja inativar ${professor.nome}? Ele não aparecerá mais nas listas ativas.`
                                : `Você deseja reativar o cadastro de ${professor.nome}? Ele voltará a aparecer nas listas.`
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