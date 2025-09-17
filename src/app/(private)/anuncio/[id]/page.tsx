"use client";

import { useParams } from "next/navigation";
import { useAnuncioById } from "@/hooks/useAnuncioById";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/Botoes/Bottom/button-nav";

export default function AnuncioPage() {
  const { id } = useParams<{ id: string }>();
  const { anuncio, isPending, isError, error } = useAnuncioById(id);

  const getCondicaoColor = (condicao: string) => {
    switch (condicao) {
      case "NOVO":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-500 dark:border-green-300";
      case "SEMINOVO":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-500 dark:border-yellow-300";
      case "USADO":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-500 dark:border-orange-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTipoColor = (tipo: string) => {
    return tipo === "DOACAO"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-500 dark:border-green-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-500 dark:border-blue-300";
  };

  if (!id) return <div className="p-8 text-center">Carregando...</div>;
  if (isPending)
    return <div className="p-8 text-center">Carregando anúncio...</div>;
  if (isError)
    return <div className="p-8 text-center">Erro: {error?.message}</div>;
  if (!anuncio)
    return <div className="p-8 text-center">Anúncio não encontrado.</div>;

  return (
    <div className="min-h-dvh bg-background flex flex-col pt-6">
      {/* Header */}
      <header className="flex justify-between px-6">
        <div className="flex items-center space-x-4">
          <Link href="/tela-inicial">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-primary">
            Voltar
          </h1>
        </div>
      </header>

      <div className="p-4 max-w-sm mx-auto w-full pb-44">
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
                  ) as { url_imagem: string; principal: boolean } | undefined)
                : undefined;
              return principal ? (
                <Image
                  src={principal.url_imagem}
                  alt={anuncio.titulo}
                  className="object-cover w-full h-full"
                  width={200}
                  height={200}
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
        <h1 className="text-2xl font-bold mb-2 text-foreground">
          {anuncio.titulo}
        </h1>
        {anuncio.marca && (
          <p className="text-sm text-muted-foreground mb-2">{anuncio.marca}</p>
        )}

        <div className="flex gap-3 mb-2">
          <Badge className={getCondicaoColor(anuncio.condicao)}>
            {anuncio.condicao}
          </Badge>
          <Badge className={getTipoColor(anuncio.tipo)}>{anuncio.tipo}</Badge>
        </div>

        {/* {anuncio.endereco_completo && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{anuncio.endereco_completo}</span>
          </div>
        )} */}

        <p className="font-semibold">Descrição: </p>
        <p className="text-base text-foreground mb-4">{anuncio.descricao}</p>
      </div>

      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
