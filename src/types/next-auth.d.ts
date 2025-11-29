import NextAuth, { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client"; // Importa o Enum do Prisma
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Estende a sessão para incluir a role.
   * Isso corrige o erro: Property 'role' does not exist on type 'User'.
   */
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }

  /**
   * Estende o objeto User que vem do banco (authorize)
   */
  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  /**
   * Estende o JWT para aceitar a role
   */
  interface JWT {
    role: UserRole;
  }
}
