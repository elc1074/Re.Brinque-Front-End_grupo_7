"use client";

import { useAnuncioMutation } from "@/hooks/useAnuncio";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import IAnuncio from "@/interface/IAnuncio";
import Link from "next/link";

export default function ListagemAnuncios() {
  const { anuncios, isPendingAnuncios, isErrorAnuncios } = useAnuncioMutation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Garante que lista sempre será um array de anúncios
  const lista: IAnuncio[] = anuncios && typeof anuncios === "object" && "anuncios" in anuncios
    ? (anuncios as { anuncios: IAnuncio[] }).anuncios
    : Array.isArray(anuncios)
      ? anuncios as IAnuncio[]
      : [];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  
  const getCondicaoColor = (condicao: string) => {
    switch (condicao) {
      case "NOVO":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "SEMINOVO":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "USADO":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
        default:
          return "bg-muted text-muted-foreground";
    }
  };

  const getTipoColor = (tipo: string) => {
    return tipo === "DOACAO"
    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
  };

  if (isPendingAnuncios) {
    return (
      <div className="px-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground items-center">
          <Loader2 className="animate-spin mr-2 inline-block text-primary" />
          Carregando Anúncios Recentes
        </h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="min-w-[260px] animate-pulse">
              <div className="aspect-square bg-muted rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded mb-2 w-3/4" />
                <div className="flex gap-2 mb-2">
                  <div className="h-5 bg-muted rounded w-16" />
                  <div className="h-5 bg-muted rounded w-12" />
                </div>
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (isErrorAnuncios || lista.length === 0) {
    return (
      <div className="px-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Anúncios Recentes
        </h2>
        <div className="text-center py-8 text-muted-foreground">
          {isErrorAnuncios
            ? "Erro ao carregar anúncios"
            : "Nenhum anúncio encontrado"}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Anúncios Recentes
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="h-8 w-8 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="h-8 w-8 bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {lista.map((anuncio) => (
          <Link
            key={`${anuncio.id}`}
            href={`/anuncio/${anuncio.id}`}
            className="min-w-[250px] hover:shadow-lg transition-shadow cursor-pointer block"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card>
              <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                {anuncio.imagens && anuncio.imagens.length > 0 ? (
                  <>
                    <p>Imagem não implementada</p>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <span className="text-sm">Sem imagem</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2 leading-tight">
                  {anuncio.titulo}
                </h3>
                {anuncio.marca && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {anuncio.marca}
                  </p>
                )}
                <div className="flex gap-2 mb-3 flex-wrap">
                  <Badge className={getCondicaoColor(anuncio.condicao)}>
                    {anuncio.condicao}
                  </Badge>
                  <Badge className={getTipoColor(anuncio.tipo)}>
                    {anuncio.tipo}
                  </Badge>
                </div>
                {anuncio.endereco_completo && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {anuncio.endereco_completo}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
