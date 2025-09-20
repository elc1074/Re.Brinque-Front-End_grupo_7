"use client";

import { useParams } from "next/navigation";
import { useAnuncioById } from "@/hooks/useAnuncioById";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/Botoes/Bottom/button-nav";
import ImageCarousel from "@/components/Anuncios/Anuncio-image";

export default function AnuncioPage() {
  const { id } = useParams<{ id: string }>();
  const { anuncio, isPending, isError, error } = useAnuncioById(id);

  
  const categorias = [
    { id: 1, nome: "Artísticos", icon: "🎨" },
    { id: 2, nome: "Aventura", icon: "🏔️" },
    { id: 3, nome: "Bonecos", icon: "🤖" },
    { id: 4, nome: "Carrinhos", icon: "🚗" },
    { id: 5, nome: "Cartas", icon: "🃏" },
    { id: 6, nome: "Educativos", icon: "📚" },
    { id: 7, nome: "Esportes", icon: "⚽" },
    { id: 8, nome: "Estratégia", icon: "♟️" },
    { id: 9, nome: "Palavras", icon: "📝" },
    { id: 10, nome: "Para bebês", icon: "👶" },
    { id: 11, nome: "Quebra-cabeças", icon: "🧩" },
    { id: 12, nome: "Simulação", icon: "🎮" },
    { id: 13, nome: "Tabuleiros", icon: "🎲" },
    { id: 14, nome: "Videogames", icon: "🎮" },
  ];
  
  const categoria_id = categorias.find((c) => c.id === anuncio?.categoria_id);

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

  const imagensNormalizadas = Array.isArray(anuncio.imagens)
    ? anuncio.imagens
        .map((img: any) =>
          typeof img === "string" ? { url_imagem: img } : img
        )
        .filter((img: any) => img && typeof img.url_imagem === "string")
    : [];

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

      <div className="pt-6 max-w-sm mx-auto w-full pb-44">
        <div className="aspect-square overflow-hidden">
          <ImageCarousel
            imagens={imagensNormalizadas}
            titulo={anuncio.titulo}
          />
        </div>

        {/* Titulo */}
        <h1 className="pt-4 pb-2 text-2xl font-bold mb-2 text-foreground">
          {anuncio.titulo}
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Marca */}
          <div className="flex-col">
            <p className="font-semibold">Marca </p>
            <span className="text-muted-foreground">
              {anuncio.marca || "Sem marca"}
            </span>
          </div>

          <div className="flex-col">
            <p className="font-semibold">Condição </p>
            <Badge className={getCondicaoColor(anuncio.condicao)}>
              {anuncio.condicao}
            </Badge>
          </div>

          <div className="flex-col">
            <p className="font-semibold">Tipo </p>
            <Badge className={getTipoColor(anuncio.tipo)}>{anuncio.tipo}</Badge>
          </div>

          {/* {anuncio.endereco_completo && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{anuncio.endereco_completo}</span>
          </div>
        )} */}

          {anuncio.categoria_id && (
            <div className="flex-col">
              <p className="font-semibold">Categoria </p>
              <span className="text-muted-foreground">
                {categoria_id
                  ? `${categoria_id.icon} ${categoria_id.nome}`
                  : "Sem categoria"}
              </span>
            </div>
          )}

        </div>
          <p className="font-semibold">Descrição</p>
          <p className="text-base text-foreground mb-4">{anuncio.descricao}</p>
      </div>

      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
