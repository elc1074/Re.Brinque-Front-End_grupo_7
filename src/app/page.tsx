import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/logo.svg";

export default function HomePage() {
  return (
    <div className="bg-zinc-100 min-h-screen flex flex-col">
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-50 h-50 bg-zinc-300 mx-auto rounded-full flex items-center justify-center">
          <Image src={logo} width={300} height={300} alt="Logo re.Brinque" />
        </div>

        <div className="space-y-2 mt-6">
          <h1 className="text-3xl font-bold text-primary">re.Brinque</h1>
          <p className="text-muted-foreground text-sm mt-12">
            Pais espertos não compram tudo. <br />
            Compartilham brinquedos!
          </p>
          <p className="text-xs text-muted-foreground">
            Mais diversão, menos bagunça (e gastos)!
          </p>
        </div>
      </div>

      {/* Footer fixo no final da tela */}
      <footer className="bg-white border-t rounded-t-2xl p-6">
        <div className="flex flex-col gap-4">
          <Button asChild className="h-12 text-base font-medium bg-primary">
            <Link href="/login">Acessar minha conta</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="h-12 text-base bg-transparent text-primary"
          >
            <Link href="/cadastro">Criar conta</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
