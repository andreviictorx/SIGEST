"use server";

import { signIn, signOut } from "@/auth";
import { loginSchema } from "@/lib/schema";
import { AuthError } from "next-auth";


export async function realizarLoginAction(data: loginSchema) {
  try {
    const result = loginSchema.safeParse(data)
    if(!result.success){
      return {erro: 'Dados inválidos enviados ao servidor'}
    }

    const {email, password} = result.data
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

export async function realizarLogoutAction() {
  try {
    
    await signOut({ redirectTo: "/login" });
  } catch (error) {
    throw error;
  }
}


