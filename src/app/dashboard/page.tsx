import CardDashboard from "@/components/card-dashboard";


export default function Dashboard() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl mb-6 font-bold">Dashboard Acadêmico</h1>
            <div className='gap-4 w-full overflow-hidden '>
                <div className="px-0 shadow-[0_4px_12px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CardDashboard
                        value={0}
                        label="Alunos Matriculados"
                        iconColor="text-blue-500"
                    />
                    <CardDashboard
                        value={0}
                        label="Alunos Matriculados"
                        iconColor="text-blue-500"
                    />
                    <CardDashboard
                        value={0}
                        label="Alunos Matriculados"
                        iconColor="text-blue-500"
                    />
                </div>
               
            </div>

        </div>
    )
}