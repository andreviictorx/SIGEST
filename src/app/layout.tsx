import { Button } from "@/components/ui/button";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  const session = await auth();

  const userInitials = session?.user?.name ? session.user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'U';

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Alunos', href: '/alunos' },
    { label: 'Professores', href: '/professores' },
    { label: 'Turmas', href: '/turmas' },
    { label: 'Disciplinas', href: '/disciplinas' },
  ];


  if (session?.user?.role === 'ADMIN') {
    menuItems.push({ label: 'Usuários', href: '/admin/usuarios' });
  }

  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">

        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl supports-backdrop-filter:bg-white/60">
          <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">

            <div className="flex items-center gap-8">

              <Link href="/dashboard" className="flex items-center gap-2.5 group">
                <div className="h-9 w-9 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-lg leading-none">S</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">SIGESTE</span>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-blue-600">Acadêmico</span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-1">

                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    asChild
                    className="text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 px-4 py-2 h-9 rounded-full transition-all"
                  >
                    <Link href={item.href}>
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>


            <div className="flex items-center gap-4">
              {session && (
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200 h-8">


                  <div className="hidden sm:flex flex-col items-end mr-1">
                    <span className="text-sm font-semibold text-slate-800 leading-none">
                      {session.user?.name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium lowercase">
                      {session.user?.email}
                    </span>
                  </div>


                  <div className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shadow-sm">
                    {userInitials}
                  </div>

                  <LogoutButton />
                </div>
              )}
            </div>
          </div>
        </header>


        <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
          {children}
          <Toaster richColors position="top-right" closeButton theme="light" />
        </main>


        <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-white/50">
          &copy; {new Date().getFullYear()} SIGESTE - Sistema de Gestão Escolar
        </footer>

      </body>
    </html>
  );
}