import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlunoForm } from "./_components/aluno-form";
import { SearchInput } from "@/components/searchInput"; 
import { ActionsCell } from "./_components/actions-cell";


type Props = {
    searchParams: Promise<{ q?: string }>;
}

export default async function PageAlunos({ searchParams }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const params = await searchParams;
  const query = params?.q || "";

  const alunos = await prisma.aluno.findMany({
    where: {
      OR: [
        { nome: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { matricula: { contains: query } },
      ],
    },
    orderBy: { nome: 'asc' },
  });


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">
   
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alunos</h1>
          <p className="text-slate-500">Gerencie as matrículas e dados dos estudantes.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <SearchInput placeholder="Buscar por nome, email..." />
          <AlunoForm />
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Listagem Geral</CardTitle>
              <CardDescription>
                Mostrando {alunos.length} registros encontrados.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] pl-6">Aluno</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alunos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    Nenhum aluno encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                alunos.map((aluno) => (
                  <TableRow key={aluno.id} className="hover:bg-slate-50 group transition-colors">
                    
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-slate-200">
                         
                          <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">
                            {getInitials(aluno.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {aluno.nome}
                          </span>
                          <span className="text-xs text-slate-500">{aluno.email}</span>
                        </div>
                      </div>
                    </TableCell>

                 
                    <TableCell className="font-mono text-slate-600">
                      {aluno.matricula}
                    </TableCell>

                    <TableCell className="text-slate-600">
                      {aluno.telefone || "-"}
                    </TableCell>

                    <TableCell>
                      <Badge 
                        variant={aluno.ativo ? "default" : "destructive"}
                        className={aluno.ativo 
                          ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none" 
                          : "bg-red-100 text-red-700 hover:bg-red-200 border-red-200 shadow-none"
                        }
                      >
                        {aluno.ativo ? "Matriculado" : "Inativo"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                  
                      <ActionsCell aluno={aluno}/>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}