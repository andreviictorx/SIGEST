import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { DisciplinaCard } from "./_components/disciplina-card";
import { DisciplinasToolbar } from "./_components/disciplinas-toolbar";
import { getDisiciplinas } from "@/actions/disciplina";



type Props = {
    searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function DisciplinasPage(props: Props) {
    const session = await auth();
    if (!session) redirect("/login");

    const searchParams = await props.searchParams;

    const query = searchParams?.q || "";
    const statusFilter = searchParams?.status || "todos";

    const disciplinas = await getDisiciplinas(query, statusFilter)

    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto">
            <DisciplinasToolbar />

            {disciplinas.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-4xl border border-slate-100 shadow-sm mt-4">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">Nenhuma disciplina encontrado</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">
                        Tente ajustar os filtros ou a busca por nome/matrícula.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-4">
                    {disciplinas.map((disc) => (
                        <DisciplinaCard key={disc.id} data={disc} />
                    ))}
                </div>
            )}
        </div>
    );
}