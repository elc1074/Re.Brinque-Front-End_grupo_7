"use client";

import { useAnuncioMutation } from "@/hooks/useAnuncio";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type IAnuncio from "@/interface/IAnuncio";
import Link from "next/link";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

type Props = {
  busca?: string;
  categoriaId?: string;
  tipo?: string;
  condicao?: string;
};

export default function ListagemAnuncios({
  busca = "",
  categoriaId = "all",
  tipo = "all",
  condicao = "all",
}: Props) {
  const { anuncios, isPendingAnuncios, isErrorAnuncios } = useAnuncioMutation();

  // Garante que lista sempre será um array de anúncios
  let lista: IAnuncio[] =
    anuncios && typeof anuncios === "object" && "anuncios" in anuncios
      ? (anuncios as { anuncios: IAnuncio[] }).anuncios
      : Array.isArray(anuncios)
      ? (anuncios as IAnuncio[])
      : [];

  // Filtro de busca por título
  if (busca && busca.trim() !== "") {
    const buscaLower = busca.trim().toLowerCase();
    lista = lista.filter((anuncio) =>
      anuncio.titulo.toLowerCase().includes(buscaLower)
    );
  }

  // Filtro por categoria
  if (categoriaId && categoriaId !== "all") {
    lista = lista.filter(
      (anuncio) => String(anuncio.categoria_id) === categoriaId
    );
  }

  // Filtro por tipo
  if (tipo && tipo !== "all") {
    lista = lista.filter((anuncio) => anuncio.tipo === tipo);
  }

  // Filtro por condição
  if (condicao && condicao !== "all") {
    lista = lista.filter((anuncio) => anuncio.condicao === condicao);
  }

  const getTipoColor = (tipo: string) => {
    return tipo === "DOACAO"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-medium"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-medium";
  };

  if (isPendingAnuncios) {
    return (
      <div className="px-6 mt-6 pb-36">
        <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
          <Loader2 className="animate-spin text-primary" size={24} />
          Carregando Anúncios
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-2xl" />
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isErrorAnuncios || lista.length === 0) {
    return (
      <div className="px-6 mt-6">
        <h2 className="text-xl font-semibold mb-6 text-foreground">
          Anúncios Recentes
        </h2>
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl">
          <p className="text-lg font-medium">
            {isErrorAnuncios
              ? "Erro ao carregar anúncios"
              : "Nenhum anúncio encontrado"}
          </p>
          <p className="text-sm mt-2">
            {!isErrorAnuncios && "Tente ajustar os filtros de busca"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 mt-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Anúncios Recentes
        <span className="text-sm font-normal text-muted-foreground ml-2">
          ({lista.length} {lista.length === 1 ? "resultado" : "resultados"})
        </span>
      </h2>
      <ScrollArea>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pb-32 px-1">
          {lista.map((anuncio) => (
            <Link
              key={`${anuncio.id}`}
              href={`/anuncio/${anuncio.id}`}
              className="group block"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border border-border/50">
                <div className="aspect-square overflow-hidden bg-muted relative">
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
                          src={principal.url_imagem || "/placeholder.svg"}
                          alt={anuncio.titulo}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                          width={300}
                          height={300}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                          <span className="text-xs">Sem imagem</span>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                      <span className="text-xs">Sem imagem</span>
                    </div>
                  )}
                  {/* Badge de tipo sobreposto */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`${getTipoColor(
                        anuncio.tipo
                      )} shadow-md text-xs px-2 py-0.5`}
                    >
                      {anuncio.tipo}
                    </Badge>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {anuncio.titulo}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {anuncio.marca || "Sem marca"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
