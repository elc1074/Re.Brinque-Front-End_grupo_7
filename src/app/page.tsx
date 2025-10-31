import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/image.png";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-primary dark:to-primary/90 min-h-dvh flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 dark:bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 dark:bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <section className="absolute top-4 right-4">
          <ModeToggle className="text-primary dark:text-white" />
        </section>

        <div className="flex items-center justify-center mb-8 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 dark:bg-white/20 rounded-full blur-2xl animate-pulse" />
            <Image
              src={logo}
              alt="Logo re.Brinque"
              width={150}
              height={150}
              className="relative z-10 drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="space-y-4 animate-in slide-in-from-bottom duration-700 delay-150">
          <h1 className="text-4xl font-bold text-primary dark:text-white tracking-tight">
            re.Brinque
          </h1>
          <div className="space-y-3 mt-8">
            <p className="text-lg text-foreground/80 dark:text-white/90 font-medium leading-relaxed max-w-sm mx-auto">
              Pais espertos não compram tudo.
              <br />
              <span className="text-primary dark:text-white font-semibold">
                Compartilham brinquedos!
              </span>
            </p>
            <p className="text-sm text-muted-foreground dark:text-white/70 max-w-xs mx-auto">
              Mais diversão, menos bagunça (e gastos)!
            </p>
          </div>
        </div>
      </div>

      {/* Footer fixo no final da tela */}
      <footer className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-700/50 rounded-t-3xl p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-500 delay-300">
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          <Button
            asChild
            className="h-12 text-base font-semibold bg-primary hover:bg-primary/90 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <Link href="/login">Acessar minha conta</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-12 text-base font-medium text-primary hover:text-primary/80 hover:bg-primary/5 transition-all duration-300"
          >
            <Link href="/cadastro">Criar conta</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
