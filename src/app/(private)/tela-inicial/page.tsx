"use client";

import BottomNav from "@/components/Botoes/Bottom/button-nav";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { MessageSquareText, Search } from "lucide-react";
import ListagemAnuncios from "@/components/Anuncios/listagem-anuncios";
import { useEffect, useState } from "react";
import FiltroSheet from "@/components/Anuncios/FiltroSheet";
import PWAPrompt from "@/components/PWAPrompt";
import Link from "next/link";

export default function TelaInicial() {
  function getCookie(name: string) {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }

  const name = getCookie("nome");
  const userName = name ? decodeURIComponent(name) : "Visitante";

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLocation = localStorage.getItem("userLocation");

      if (!storedLocation) {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const location = { latitude, longitude };
              localStorage.setItem("userLocation", JSON.stringify(location));
            },
            (error) => {
              console.error("Erro ao obter a localização:", error);
            }
          );
        }
      }
    }
  }, []);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-background to-muted/20 flex flex-col pt-6 pb-24">
      {/* Header com gradiente sutil */}
      <header className="flex justify-between items-center px-6 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">Olá, {userName}</h1>
          <p className="text-sm text-muted-foreground">
            Encontre brinquedos incríveis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle className="text-primary" />
          <Link href="/conversas" className="relative">
            <div className="p-2 rounded-full hover:bg-primary/10 transition-colors duration-200">
              <MessageSquareText
                size={22}
                className="text-primary cursor-pointer"
              />
            </div>
          </Link>
        </div>
      </header>

      {/* Barra de busca melhorada */}
      <section className="px-6 mt-4 relative flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar brinquedos e jogos..."
            className="pl-11 h-12 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm focus:shadow-md transition-shadow duration-200 rounded-xl"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
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

      {/* Listagem de anúncios */}
      <div className="flex-1">
        <ListagemAnuncios
          busca={busca}
          categoriaId={filtros.categoriaId}
          tipo={filtros.tipo}
          condicao={filtros.condicao}
        />
      </div>

      <PWAPrompt />
      <BottomNav />
    </main>
  );
}
