import { Button } from "@/components/ui/button"
import Link from "next/link"
const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#1F2937]">Gerenciamentos de alunos</h1>
                <div>
                    <Button
                        type="button"
                        variant='outline'
                        asChild
                        className="bg-[#10B981] text-white rounded-md font-medium text-sm border-none py-2 px-4"
                    >
                        <Link href='/novoaluno'>Adicionar aluno</Link>
                    </Button>
                </div>
            </div>
            <main>
                {children}
            </main>
        </div>
    )
}

export default layout
