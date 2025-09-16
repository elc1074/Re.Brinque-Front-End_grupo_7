"use client";

import { useAnuncioMutation } from "@/hooks/useAnuncio";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import IAnuncio from "@/interface/IAnuncio";
import Link from "next/link";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";

export default function ListagemAnuncios() {
  const { anuncios, isPendingAnuncios, isErrorAnuncios } = useAnuncioMutation();

  // Garante que lista sempre será um array de anúncios
  const lista: IAnuncio[] =
    anuncios && typeof anuncios === "object" && "anuncios" in anuncios
      ? (anuncios as { anuncios: IAnuncio[] }).anuncios
      : Array.isArray(anuncios)
      ? (anuncios as IAnuncio[])
      : [];

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
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-500 dark:border-green-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-500 dark:border-blue-300";
  };

  if (isPendingAnuncios) {
    return (
      <div className="px-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground items-center">
          <Loader2 className="animate-spin mr-2 inline-block text-primary" />
          Carregando Anúncios Recentes
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
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
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Anúncios Recentes
      </h2>
      <ScrollArea>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pb-30 pr-1">
          {lista.map((anuncio) => (
            <Link
              key={`${anuncio.id}`}
              href={`/anuncio/${anuncio.id}`}
              className="hover:shadow-lg transition-shadow cursor-pointer block"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                {anuncio.imagens && anuncio.imagens.length > 0 ? (
                  (() => {
                    const principal = Array.isArray(anuncio.imagens)
                      ? (anuncio.imagens.find(
                          (img: any) =>
                            typeof img === "object" &&
                            img !== null &&
                            "url_imagem" in img &&
                            img.principal
                        ) as
                          | { url_imagem: string; principal: boolean }
                          | undefined)
                      : undefined;
                    return principal ? (
                      <Image
                        src={principal.url_imagem}
                        alt={anuncio.titulo}
                        className="object-cover w-full h-full"
                        width={300}
                        height={300}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <span className="text-sm">Sem imagem principal</span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <span className="text-sm">Sem imagem</span>
                  </div>
                )}
              </div>
              <div className="space-y-1 mt-2">
                <Badge className={getTipoColor(anuncio.tipo)}>
                  {anuncio.tipo}
                </Badge>
                <h3 className="text-foreground">{anuncio.titulo}</h3>
                {anuncio.marca && (
                  <p className="text-sm text-muted-foreground">
                    {anuncio.marca}
                  </p>
                )}
                {/* <Badge className={getCondicaoColor(anuncio.condicao)}>
                      {anuncio.condicao}
                      </Badge> */}
                {/* {anuncio.endereco_completo && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                    {anuncio.endereco_completo}
                    </span>
                    </div>
                    )} */}
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
