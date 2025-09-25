"use client";

import BottomNav from "@/components/Botoes/Bottom/button-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search } from "lucide-react";
import ListagemAnuncios from "@/components/Anuncios/listagem-anuncios";
import { useState } from "react";
import Link from "next/link";
import FiltroSheet from "@/components/Anuncios/FiltroSheet";
import Header from "@/components/Headers/header";

export default function TelaInicial() {
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
    <div className="min-h-dvh bg-background flex flex-col pt-6">
      <Header texto="Buscar anúncios" />

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
        <Button variant="link" size="icon" className="ml-2">
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
        </Button>
      </section>

      <div>
        <ListagemAnuncios
          busca={busca}
          categoriaId={filtros.categoriaId}
          tipo={filtros.tipo}
          condicao={filtros.condicao}
        />
      </div>

      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
