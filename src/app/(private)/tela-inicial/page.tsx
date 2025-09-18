"use client";

import BottomNav from "@/components/Botoes/Bottom/button-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { MessageSquareText, Search, SlidersHorizontal } from "lucide-react";
import ListagemAnuncios from "@/components/Anuncios/listagem-anuncios";

export default function TelaInicial() {

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

 const name = getCookie("nome");
 const userName = name ? decodeURIComponent(name) : "";

  return (
    <main className="min-h-dvh bg-background flex flex-col pt-6">
      <header className="flex justify-between px-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-primary">
          Olá, {userName}
        </h1>
        <div className="flex items-center gap-4">
          <ModeToggle className="text-primary" />
          <MessageSquareText size={22} className="text-primary" />
        </div>
      </header>

      <section className="px-6 mt-4 relative flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar brinquedos e jogos..."
            className="pl-10 focus-visible:ring-0 focus-visible:border-primary"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
        <Button variant="link" size="icon" className="ml-2">
          <SlidersHorizontal className="!size-5" />
        </Button>
      </section>

      <div className="">
        <ListagemAnuncios />
      </div>

      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </main>
  );
}
