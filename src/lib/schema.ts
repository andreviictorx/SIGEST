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