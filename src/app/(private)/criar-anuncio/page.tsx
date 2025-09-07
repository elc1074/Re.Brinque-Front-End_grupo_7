import ButtonNav from "@/components/Botoes/Bottom/button-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { MessageSquareText, Search, SlidersHorizontal, X } from "lucide-react";
import { cookies } from "next/headers";

export default async function TelaInicial() {
  const cookieStore = await cookies();
  const nome = cookieStore.get("nome")?.value;
  const userId = cookieStore.get("id")?.value;

  return (
    <main className="min-h-dvh bg-background flex flex-col pt-6">
      <header className="flex justify-between px-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-primary">
          Criar anúncio
        </h1>
        <div className="flex items-center gap-4">
          <X className="text-zinc-500" />
        </div>
      </header>
      
        {/* Formulário de criação de anúncio */}

      <div className="mt-auto flex justify-center">
        <ButtonNav />
      </div>
    </main>
  );
}
