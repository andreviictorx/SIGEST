import { Button } from "@/components/ui/button";
import "./globals.css";
import Link from "next/link";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] w-screen h-screen overflow-hidden">
        <header className="flex items-center justify-between min-h-100vh h-18 bg-stone-100 p-8 shadow-lg">
          <h1 className="text-2xl font-medium text-popover-foreground">SIGESTE - Sistema de Gestão Escolar</h1>
          <nav className="flex gap-3">
            <Button type='button' variant='default' asChild>
              <Link href='/dashboard'>Dashboard</Link>
            </Button>
            <Button type='button' variant='default' asChild>
              <Link href='/alunos'>Alunos</Link>
            </Button>
            <Button type='button' variant='default' asChild>
              <Link href='/dashboard'>Dashboard</Link>
            </Button>
            <Button type='button' variant='default' asChild>
              <Link href='/dashboard'>Dashboard</Link>
            </Button>
            <Button type='button' variant='default' asChild>
              <Link href='/dashboard'>Dashboard</Link>
            </Button>
          </nav>
        </header>
        <main className="flex flex-1 p-8 max-w-300 w-full my-0 mx-auto box-border ">
          {children}
        </main>
      </body>
    </html>
  );
}
