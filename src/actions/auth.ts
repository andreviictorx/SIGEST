"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type EstadoLogin =
  | {
      erro?: string;
      sucesso?: boolean;
    }
  | undefined;

export async function realizarLoginAction(
  prevState: EstadoLogin,
  formData: FormData
) {
  try {
   
    const email = formData.get("email");
    const password = formData.get("password");

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
  
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { erro: "Email ou palavra-passe incorretos." };
        default:
          return { erro: "Ocorreu um erro. Tenta novamente." };
      }
    }

    throw error;
  }
}
