import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type loginSchema = z.infer<typeof loginSchema>;
