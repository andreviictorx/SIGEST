import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type loginSchema = z.infer<typeof loginSchema>;

export const alunoSchema = z.object({
  nome: z.string().min(5, 'O nome deve ter pelo menos 5 caracteres'),
  email: z.string().email('insira um email válido'),
  matricula: z.string().min(4, 'A matricula deve ter no minimo 4 caracteres'),
  telefone: z.string().optional()
})

export type AlunoSchema = z.infer<typeof alunoSchema>
