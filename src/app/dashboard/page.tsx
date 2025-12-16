import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminView } from "./_components/admin-view";
import { ProfessorView } from "./_components/professor-view";
import { AlunoView} from "../dashboard/_components/aluno-view."; 

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user.email) {
        redirect("/login");
    }
    const { role, email } = session.user;

    switch (role) {
        case "ADMIN":
            return <AdminView />;
        case "PROFESSOR":
            return <ProfessorView email={email} />;
        case "ALUNO":
            return <AlunoView email={email} />;
        default:
            return <div>Perfil de usuário desconhecido ou sem permissão.</div>;
    }
}