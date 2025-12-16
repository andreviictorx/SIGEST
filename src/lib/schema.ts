import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type loginSchema = z.infer<typeof loginSchema>;

export const alunoSchema = z.object({
  nome: z.string().min(4, 'O nome deve ter pelo menos 5 caracteres'),
  email: z.string().email('insira um email válido'),
  matricula: z.string().min(4, 'A matricula deve ter no minimo 4 caracteres'),
  telefone: z.string().optional()
})

export type AlunoSchema = z.infer<typeof alunoSchema>


export const disciplinaSchema= z.object({
  nome: z.string().min(5, 'A disciplina deve ter no minimo 5 caracteres'),
  codigo: z.string().min(4,'Codigos de disciplina devem ter no minimo 4 caracteres'),
  cargaHoraria: z.number().min(2, 'A carga horaria deve ter no minimo 2 caracteres')
})

export type DisciplinaSchema = z.infer<typeof disciplinaSchema>


export const professorSchema = z.object({
  nome: z.string().min(2, 'O nome do professor deve ter no minimo 2 caracteres'),
  email: z.string().email('Insira um email valido'),
  matricula: z.string().min(2,'A matricula deve ter no minimo 2 caracteres')
})


export type ProfessorSchema = z.infer<typeof professorSchema>


export const turmaSchema = z.object({
  nome: z.string().min(2, 'A turma deve ter no minimo 2 caracteres'),
  codigo: z.string().min(2, 'O codigo deve ser maior que 2 caracteres'),
  professorId: z.string().min(1, 'Selecione um professor'),
  disciplinaId: z.string().min(1, 'Selecione uma disciplina')
})

export type TurmaSchema = z.infer<typeof turmaSchema>

export const matriculaSchema = z.object({
  alunoId: z.string().min(1, 'selecione uma turma')
})

export type MatriculaSchema = z.infer<typeof matriculaSchema>

export const usuarioSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["ADMIN", "PROFESSOR", "ALUNO"]),
});

export type UsuarioSchema = z.infer<typeof usuarioSchema>;