// app/anuncio/[id]/page.tsx (CLIENTE)
"use client";
import { useParams } from "next/navigation";
import { useAnuncioById } from "@/hooks/useAnuncioById";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/Botoes/Bottom/button-nav";

export default function AnuncioPage() {
  const { id } = useParams<{ id: string }>();
  const { anuncio, isPending, isError, error } = useAnuncioById(id);

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

      <div className="p-4">
        <Card>
          <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
            {anuncio.imagens?.length ? (
              <p>Imagem não implementada</p>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <span className="text-sm">Sem imagem</span>
              </div>
            )}
          </div>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-2 text-foreground">
              {anuncio.titulo}
            </h1>
            {anuncio.marca && (
              <p className="text-sm text-muted-foreground mb-2">
                {anuncio.marca}
              </p>
            )}
            <div className="flex gap-2 mb-3 flex-wrap">
              <Badge>{anuncio.condicao}</Badge>
              <Badge>{anuncio.tipo}</Badge>
            </div>
            {anuncio.endereco_completo && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{anuncio.endereco_completo}</span>
              </div>
            )}
            <p className="text-base text-foreground mb-4">
              {anuncio.descricao}
            </p>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
