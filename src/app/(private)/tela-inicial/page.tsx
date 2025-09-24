'use client';

import BottomNav from "@/components/Botoes/Bottom/button-nav";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { MessageSquareText, Search } from "lucide-react";
import ListagemAnuncios from "@/components/Anuncios/listagem-anuncios";
import { useState, useEffect } from "react";
import FiltroSheet from "@/components/Anuncios/FiltroSheet";
import PWAPrompt from "@/components/PWAPrompt";
import ConversationList from "@/components/Chat/ConversationList";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TelaInicial() {
  const router = useRouter();

  function getCookie(name: string) {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }

  const name = getCookie("nome");
  const userId = Number(getCookie("id"));
  const userName = name ? decodeURIComponent(name) : "";

  const [busca, setBusca] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [categoriaId, setCategoriaId] = useState<string>("all");
  const [tipo, setTipo] = useState<string>("all");
  const [condicao, setCondicao] = useState<string>("all");
  const [filtros, setFiltros] = useState({
    categoriaId: "all",
    tipo: "all",
    condicao: "all",
  });


  return (
    <main className="min-h-dvh bg-background flex flex-col pt-6">
      <header className="flex justify-between px-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-primary">
          Olá, {userName}
        </h1>
        <div className="flex items-center gap-4">
          <ModeToggle className="text-primary" />
          <Link href="/conversas">
            <MessageSquareText
              size={22}
              className="text-primary cursor-pointer"
            />
          </Link>
        </div>
      </header>

        <>
          <section className="px-6 mt-4 relative flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Buscar brinquedos e jogos..."
                className="pl-10"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            <FiltroSheet
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              categoriaId={categoriaId}
              setCategoriaId={setCategoriaId}
              tipo={tipo}
              setTipo={setTipo}
              condicao={condicao}
              setCondicao={setCondicao}
              onAplicar={() => {
                setFiltros({ categoriaId, tipo, condicao });
                setSheetOpen(false);
              }}
            />
          </section>

          <div>
            <ListagemAnuncios
              busca={busca}
              categoriaId={filtros.categoriaId}
              tipo={filtros.tipo}
              condicao={filtros.condicao}
            />
          </div>
        </>

      <PWAPrompt />

      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </main>
  );
}
