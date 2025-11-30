'use client';

import { useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { inativarAlunoAction } from "@/actions/alunos";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    }
}

export function ActionsCell({ aluno }: ActionsCellProps) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            const resultado = await inativarAlunoAction(aluno.id);

            if (resultado.sucesso) {
                toast.success("Aluno inativado com sucesso.");
                setIsAlertOpen(false); 
            } else {
                toast.error("Erro ao inativar aluno.");
            }
        });
    }

    return (
        <>
            {/* 1. O Menu dos "3 pontinhos" */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>

                    <DropdownMenuItem onClick={() => toast.info("Edição: Próxima Sprint!")}>
                        <Pencil className="mr-2 h-4 w-4 text-blue-600" /> Editar
                    </DropdownMenuItem>

                    {/* Ao clicar aqui, abrimos o Alert Dialog, não deletamos direto */}
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-700 cursor-pointer"
                        onClick={() => setIsAlertOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Inativar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 2. O Modal de Confirmação (Invisível até clicar em Inativar) */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Isso marcará o aluno <strong>{aluno.nome}</strong> como inativo no sistema.
                            Ele não aparecerá mais nas turmas ativas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>

                        {/* O Botão que realmente deleta */}
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault(); // Impede fechar automático para mostrar loading
                                handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inativando...</>
                            ) : (
                                "Sim, inativar"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}