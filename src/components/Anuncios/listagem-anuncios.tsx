"use client";

import { useAnuncioMutation } from "@/hooks/useAnuncio";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import IAnuncio from "@/interface/IAnuncio";
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

export default function ListagemAnuncios({ busca = "", categoriaId = "all", tipo = "all", condicao = "all" }: Props) {
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
    lista = lista.filter((anuncio) => String(anuncio.categoria_id) === categoriaId);
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
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-500 dark:border-green-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-500 dark:border-blue-300";
  };

  if (isPendingAnuncios) {
    return (
      <div className="px-6 mt-6 pb-36">
        <h2 className="text-xl font-semibold mb-4 text-foreground items-center">
          <Loader2 className="animate-spin mr-2 inline-block text-primary" />
          Carregando Anúncios Recentes
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Skeleton className="h-[150px] w-[150px] rounded-xl" />
          <Skeleton className="h-[150px] w-[150px] rounded-xl" />
          <Skeleton className="h-[150px] w-[150px] rounded-xl" />
          <Skeleton className="h-[150px] w-[150px] rounded-xl" />
          <Skeleton className="h-[150px] w-[150px] rounded-xl" />
          <Skeleton className="h-[150px] w-[150px] rounded-xl" />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pb-30 px-2">
          {lista.map((anuncio) => (
            <Link
              key={`${anuncio.id}`}
              href={`/anuncio/${anuncio.id}`}
              className="hover:shadow-lg transition-shadow cursor-pointer block"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
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
                  <p className="text-sm text-muted-foreground">
                    {anuncio.marca || "Sem marca"}
                  </p>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
