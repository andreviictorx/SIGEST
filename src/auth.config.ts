import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [], 
  callbacks: {
    
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      // 1. Se estiver no Dashboard (ou rotas protegidas)
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redireciona para o login
      }

      // 2. Se estiver na página de Login e já estiver logado
      if (isOnLogin) {
        if (isLoggedIn) {
          // Manda direto pro dashboard
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      return true;
    },
    
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
