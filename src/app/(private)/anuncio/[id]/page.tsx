"use client";

import { useParams, useRouter } from "next/navigation";
import { useAnuncioById } from "@/hooks/useAnuncioById";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/Botoes/Bottom/button-nav";
import ImageCarousel from "@/components/Anuncios/Anuncio-image";
import { api, getTokenFromCookies, setAuthHeader } from "@/lib/api";
import Header from "@/components/Headers/header";
import { MessageCircle, Loader2 } from "lucide-react";

export default function AnuncioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { anuncio, isPending, isError, error } = useAnuncioById(id);

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  const userId = Number(getCookie("id"));
  const isDono = userId === anuncio?.usuario_id;

  const iniciarConversa = async () => {
    const token = getTokenFromCookies();
    setAuthHeader(token);

    try {
      const res = await api.post("/api/chat/conversas", {
        anuncioId: anuncio?.id,
        interessadoId: userId,
      });

      const conversa = res.data;
      const nomeAnunciante = anuncio?.nome_usuario || "Usuário";
      router.push(
        `/chat?conversa=${conversa.id}&nome=${encodeURIComponent(
          nomeAnunciante
        )}`
      );
    } catch (err) {
      console.error("Erro ao iniciar conversa:", err);
    }
  };

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

  if (!id)
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  if (isPending)
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando anúncio...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-dvh flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">
            Erro ao carregar anúncio
          </p>
          <p className="text-sm text-muted-foreground">{error?.message}</p>
        </div>
      </div>
    );

  if (!anuncio)
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-muted-foreground">Anúncio não encontrado.</p>
      </div>
    );

  const imagensNormalizadas = Array.isArray(anuncio.imagens)
    ? anuncio.imagens
        .map((img: any) =>
          typeof img === "string" ? { url_imagem: img } : img
        )
        .filter((img: any) => img && typeof img.url_imagem === "string")
    : [];

  return (
    <div className="min-h-dvh bg-gradient-to-b from-background via-background to-primary/5 flex flex-col pt-6">
      <Header texto="Voltar" />

      <div className="pt-6 max-w-sm mx-auto w-full pb-44 px-4">
        <div className="aspect-square overflow-hidden rounded-2xl shadow-lg border border-border/50 mb-6">
          <ImageCarousel
            imagens={imagensNormalizadas}
            titulo={anuncio.titulo}
          />
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-md border border-border/50 space-y-5">
          {/* Titulo e anunciante */}
          <div>
            <h1 className="text-2xl font-bold mb-3 text-foreground leading-tight">
              {anuncio.titulo}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-muted-foreground">
                Anunciado por:
              </span>
              <span className="font-semibold text-foreground">
                {isDono
                  ? "Você"
                  : anuncio.nome_usuario || "Usuário desconhecido"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Marca
              </p>
              <p className="text-base font-medium">
                {anuncio.marca || "Sem marca"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Condição
              </p>
              <Badge
                className={`${getCondicaoColor(anuncio.condicao)} font-medium`}
              >
                {anuncio.condicao}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Tipo
              </p>
              <Badge className={`${getTipoColor(anuncio.tipo)} font-medium`}>
                {anuncio.tipo}
              </Badge>
            </div>

            {anuncio.categoria_id && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-muted-foreground">
                  Categoria
                </p>
                <p className="text-base font-medium">
                  {categoria_id
                    ? `${categoria_id.icon} ${categoria_id.nome}`
                    : "Sem categoria"}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-border/50">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Descrição
            </p>
            <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
              {anuncio.descricao}
            </p>
          </div>
        </div>

        {!isDono && (
          <Button
            onClick={iniciarConversa}
            className="w-full h-14 text-base font-semibold dark:text-white mt-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Conversar com {anuncio.nome_usuario}
          </Button>
        )}
      </div>

      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
