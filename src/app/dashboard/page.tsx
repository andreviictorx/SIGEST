import { auth } from "@/auth"; // 1. Importar a auth
import { redirect } from "next/navigation";
import CardDashboard from "@/components/card-dashboard";

export default async function Dashboard() {
 
    const session = await auth();


    if (!session) {
        redirect("/login");
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-4xl font-bold">Dashboard Acadêmico</h1>

                    <p className="text-gray-500 mt-2">
                        Bem-vindo de volta, <span className="font-semibold text-blue-600">{session.user?.name}</span>
                    </p>
                </div>


                <div className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {session.user?.role}
                </div>
            </div>

            <div className='gap-4 w-full'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CardDashboard
                        value={0}
                        label="Alunos Matriculados"

                        iconColor="text-blue-500"
                    />
                    <CardDashboard
                        value={0}
                        label="Professores"

                        iconColor="text-green-500"
                    />
                    <CardDashboard
                        value={0}
                        label="Turmas Ativas"

                        iconColor="text-orange-500"
                    />
                </div>
            </div>
        </div>
    )
}