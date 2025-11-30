
const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#1F2937]">Gerenciamentos de alunos</h1>
            </div>
            <main>
                {children}
            </main>
        </div>
    )
}

export default layout
