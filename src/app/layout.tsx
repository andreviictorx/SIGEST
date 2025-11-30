import { Button } from "@/components/ui/button";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] min-h-screen overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between h-18 bg-stone-100 p-8 shadow-md">
          <h1 className="text-2xl font-medium text-popover-foreground">SIGESTE - Sistema de Gestão Escolar</h1>
          <nav className="flex gap-3">
            <Button 
            type='button' 
            variant='default' 
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full sm:w-auto"
            >
              <Link href='/dashboard'>Dashboard</Link>
            </Button>
            <Button type='button' variant='default' asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full sm:w-auto">
              <Link href='/alunos'>Alunos</Link>
            </Button>
            <Button type='button' variant='default' asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full sm:w-auto">
              <Link href='/dashboard'>Dashboard</Link>
            </Button>
            <Button type='button' variant='default' asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full sm:w-auto">
              <Link href='/dashboard'>Dashboard</Link>
            </Button>
            <Button type='button' variant='default' asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full sm:w-auto">
              <Link href='/dashboard'>Dashboard</Link>
            </Button>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-7xl mx-auto p-8 box-border ">
          {children}
          <Toaster richColors/>
        </main>
      </body>
    </html>
  );
}
