"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { usuarioSchema, UsuarioSchema } from "@/lib/schema";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function criarUsuario(data: UsuarioSchema) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Acesso Negado. Somente admins podem cadastrar usuarios",
    };
  }

  const parsed = usuarioSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos." };
  }

  const { name, email, password, role } = parsed.data;
  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userExists) {
      return {
        success: false,
        message: "Este e-mail já possui cadastro.",
      };
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    revalidatePath("/admin/usuarios");
    return { success: true, message: "Usuário criado com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { success: false, message: "Erro interno do servidor." };
  }
}
