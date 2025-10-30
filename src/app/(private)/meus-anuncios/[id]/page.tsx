"use client";

import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useAnuncioUser, Anuncio } from "@/hooks/useAnuncioUser";
import { useDeleteAnuncio } from "@/hooks/useDeleteAnuncio";
import { useUpdateStatus } from "@/hooks/useAnuncio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import BottomNav from "@/components/Botoes/Bottom/button-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/Headers/header";

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

function getThumb(a: Anuncio) {
  const principal = a.imagens?.find((i) => i.principal);
  return (principal?.url_imagem || a.imagens?.[0]?.url_imagem || "") as string;
}

export default function MeusAnunciosPage() {
  // Estado para controlar o Dialog de exclusão por anúncio
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  // Estado para controlar o DropdownMenu por anúncio
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  // Estado de loading individual para exclusão
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const userId = getCookie("id");
  const {
    data: anuncios = [],
    isPending,
    isError,
    error,
    refetch,
  } = useAnuncioUser(userId);
  const del = useDeleteAnuncio();
  const updateStatus = useUpdateStatus();
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);

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

  return (
    <div className="min-h-dvh bg-background flex flex-col pt-6">
      <Header texto="Voltar" />

      {/* Abas */}
      <div className="px-4 mt-4">
        <Tabs defaultValue="publicados" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-10 border border-primary">
            <TabsTrigger
              value="publicados"
              className="w-full data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Publicados
            </TabsTrigger>
            <TabsTrigger
              value="finalizados"
              className="w-full data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Finalizados
            </TabsTrigger>
          </TabsList>
          <TabsContent value="publicados">
            <div className="p-0 max-w-sm mx-auto w-full pb-44">
              {publicados.length === 0 && (
                <p className="text-sm text-muted-foreground mt-6">
                  Nenhum anúncio publicado.
                </p>
              )}
              <ul className="space-y-3 mt-3">
                {publicados.map((a) => {
                  const thumb = getThumb(a);
                  const publicado = formatDate(getPublicacao(a));
                  return (
                    <li key={a.id} className="">
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
                            • Publicado em {publicado}
                          </p>
                        </div>
                        {/* Menu 3 pontos */}
                        <DropdownMenu
                          open={openMenuId === a.id || openDialogId === a.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenMenuId(a.id);
                            } else {
                              setOpenMenuId(null);
                              setOpenDialogId(null);
                            }
                          }}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => setOpenMenuId(a.id)}
                            >
                              <MoreVertical className="h-5 w-5" />
                              <span className="sr-only">Mais ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 border-2 shadow-lg dark:border-zinc-800"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/anuncio/editar/${a.id}`)
                              }
                            >
                              <Pencil className="h-4 w-4 mr-2" /> Editar anúncio
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="px-3 py-2">
                              <span className="font-semibold block mb-1">
                                Status:
                              </span>
                              <Select
                                value={a.status}
                                disabled={pendingStatusId === a.id}
                                onValueChange={async (status) => {
                                  if (status === a.status) return;
                                  setPendingStatusId(a.id);
                                  try {
                                    await updateStatus.mutateAsync({
                                      id: a.id,
                                      status,
                                    });
                                    toast.success(
                                      "Status atualizado para " + status
                                    );
                                    refetch();
                                  } finally {
                                    setPendingStatusId(null);
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="DISPONIVEL">
                                    Disponível
                                  </SelectItem>
                                  <SelectItem value="NEGOCIANDO">
                                    Negociando
                                  </SelectItem>
                                  <SelectItem value="FINALIZADO">
                                    Finalizado
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <DropdownMenuSeparator />
                            <Dialog
                              open={openDialogId === a.id}
                              onOpenChange={(open) =>
                                setOpenDialogId(open ? a.id : null)
                              }
                            >
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                  onClick={() => setOpenDialogId(a.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                                  anúncio
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Excluir anúncio</DialogTitle>
                                </DialogHeader>
                                <p className="text-sm mb-4">
                                  Tem certeza que deseja excluir este anúncio?
                                  Essa ação não pode ser desfeita.
                                </p>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setOpenDialogId(null)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    disabled={pendingDeleteId === a.id}
                                    onClick={async () => {
                                      setPendingDeleteId(a.id);
                                      try {
                                        await del.mutateAsync(a.id);
                                        setOpenDialogId(null);
                                        toast.success(
                                          "Anúncio excluído com sucesso"
                                        );
                                      } finally {
                                        setPendingDeleteId(null);
                                      }
                                    }}
                                  >
                                    {pendingDeleteId === a.id ? (
                                      <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin w-4 h-4" />{" "}
                                        Excluindo...
                                      </span>
                                    ) : (
                                      "Excluir"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="finalizados">
            <div className="p-0 max-w-sm mx-auto w-full pb-44">
              {finalizados.length === 0 && (
                <p className="text-sm text-muted-foreground mt-6">
                  Nenhum anúncio finalizado.
                </p>
              )}
              <ul className="space-y-3 mt-3">
                {finalizados.map((a) => {
                  const thumb = getThumb(a);
                  const publicado = formatDate(getPublicacao(a));
                  return (
                    <li key={a.id} className="bg-">
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
                            • Publicado em {publicado}
                          </p>
                        </div>
                        {/* Menu 3 pontos */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-5 w-5" />
                              <span className="sr-only">Mais ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/anuncio/editar/${a.id}`)
                              }
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
                              <Trash2 className="h-4 w-4 mr-2" /> Excluir
                              anúncio
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
