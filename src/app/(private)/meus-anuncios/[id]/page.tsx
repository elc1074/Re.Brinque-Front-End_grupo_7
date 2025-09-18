"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useAnuncioUser, Anuncio } from "@/hooks/useAnuncioUser";
import { useDeleteAnuncio } from "@/hooks/useDeleteAnuncio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import BottomNav from "@/components/Botoes/Bottom/button-nav";
import { toast } from "sonner";

function getCookie(name = "id") {
  const v = `; ${document.cookie}`;
  const p = v.split(`; ${name}=`);
  if (p.length === 2) return p.pop()?.split(";").shift();
}

function isFinalizado(a: Anuncio) {
  return (
    a.status === "FINALIZADO" || a.vendido === true || a.finalizado === true
  );
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function getPublicacao(anuncio: Anuncio) {
  return anuncio.data_publicacao || anuncio.created_at || "";
}

function formatPreco(a: Anuncio) {
  if (a.tipo === "DOACAO" || !a.preco || a.preco === 0) return "Doação";
  return a.preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getThumb(a: Anuncio) {
  const principal = a.imagens?.find((i) => i.principal);
  return (principal?.url_imagem || a.imagens?.[0]?.url_imagem || "") as string;
}

export default function MeusAnunciosPage() {
  const router = useRouter();
  const userId = getCookie("id");
  const {
    data: anuncios = [],
    isPending,
    isError,
    error,
  } = useAnuncioUser(userId);
  const del = useDeleteAnuncio();

  const [tab, setTab] = useState<"publicados" | "finalizados">("publicados");

  const publicados = useMemo(
    () => anuncios.filter((a) => !isFinalizado(a)),
    [anuncios]
  );
  const finalizados = useMemo(() => anuncios.filter(isFinalizado), [anuncios]);

  if (!userId) return <div className="p-8 text-center">Carregando...</div>;
  if (isPending)
    return <div className="p-8 text-center">Carregando anúncios...</div>;
  if (isError)
    return (
      <div className="p-8 text-center">
        Erro: {String(error?.message ?? "falha")}
      </div>
    );

  const lista = tab === "publicados" ? publicados : finalizados;

  return (
    <div className="min-h-dvh bg-background flex flex-col pt-6">
      {/* Header */}
      <header className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/tela-inicial" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold">Meus anúncios</h1>
        </div>
      </header>

      {/* Abas */}
      <div className="px-4 mt-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("publicados")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium border
              ${
                tab === "publicados"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
          >
            Publicados
          </button>
          <button
            onClick={() => setTab("finalizados")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium border
              ${
                tab === "finalizados"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
          >
            Finalizados
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="p-4 max-w-sm mx-auto w-full pb-44">
        {lista.length === 0 && (
          <p className="text-sm text-muted-foreground mt-6">
            Nenhum anúncio {tab === "publicados" ? "publicado" : "finalizado"}.
          </p>
        )}

        <ul className="space-y-3 mt-3">
          {lista.map((a) => {
            const thumb = getThumb(a);
            const publicado = formatDate(getPublicacao(a));
            return (
              <li key={a.id} className="rounded-xl border bg-card">
                <div className="flex items-start gap-3 p-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={a.titulo}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/anuncio/${a.id}`} className="block">
                      <p className="font-medium leading-tight line-clamp-2">
                        {a.titulo}
                      </p>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatPreco(a)} • Publicado {publicado}
                    </p>
                  </div>

                  {/* Menu 3 pontos */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">Mais ações</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                      onClick={() => toast("Não deu tempo pra fazer :c")}
                        //onClick={() => router.push(`/anuncio/editar/${a.id}`)}
                      >
                        <Pencil className="h-4 w-4 mr-2" /> Editar anúncio
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={async () => {
                          if (
                            !confirm(
                              "Excluir este anúncio? Essa ação não pode ser desfeita."
                            )
                          )
                            return;
                          await del.mutateAsync(a.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir anúncio
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
