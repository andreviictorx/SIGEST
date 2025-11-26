import { SearchInput } from "@/components/searchInput"
const pageAlunos = () => {
    return (

        <div className="w-full mt-5">
            <SearchInput placeholder="Pesquise um aluno" text="Buscar"/>
            <div>
                Lista de alunos
            </div>

        </div >
    )
}

export default pageAlunos
