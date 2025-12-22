'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import FilterButton from "./filter-button";
import { TurmaForm } from "./turma-form";

interface TurmasToolbarProps {
    professores: { id: string; nome: string }[];
    disciplinas: { id: string; nome: string }[];
}
export function TurmasToolbar({professores, disciplinas}: TurmasToolbarProps ) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();


    const currentSearch = searchParams.get('q')?.toString();
    const currentStatus = searchParams.get('status')?.toString() || 'todos';

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status === 'todos') {
            params.delete('status');
        } else {
            params.set('status', status);
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Turmas</h1>
                    <p className="text-slate-500 font-medium">Gestão de turmas</p>
                </div>
                <TurmaForm professores={professores} disciplinas={disciplinas}/>
            </div>


            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Nome ou matrícula..."
                        className="pl-12 h-14 rounded-2xl border-none bg-white shadow-sm text-base ring-1 ring-slate-100 focus-visible:ring-blue-500 placeholder:text-slate-400"
                        defaultValue={currentSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <Button className="h-14 w-14 rounded-2xl bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 p-0 shadow-sm shrink-0">
                    <SlidersHorizontal className="h-6 w-6" />
                </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                <FilterButton
                    label="Todos"
                    active={currentStatus === 'todos'}
                    onClick={() => handleStatusFilter('todos')}
                />
                <FilterButton
                    label="Ativos"
                    active={currentStatus === 'ativos'}
                    onClick={() => handleStatusFilter('ativos')}
                />
                <FilterButton
                    label="Inativos"
                    active={currentStatus === 'inativos'}
                    onClick={() => handleStatusFilter('inativos')}
                />
            </div>
        </div>
    )
}