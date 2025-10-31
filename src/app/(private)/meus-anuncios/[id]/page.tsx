"use client";

import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, Package } from "lucide-react";
import { useAnuncioUser, type Anuncio } from "@/hooks/useAnuncioUser";
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
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
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

  if (!userId)
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground animate-pulse">Carregando...</p>
        </div>
      </div>
    );

  if (isPending)
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground animate-pulse">
            Carregando anúncios...
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-dvh flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-destructive font-medium">
            Erro ao carregar anúncios
          </p>
          <p className="text-sm text-muted-foreground">
            {String(error?.message ?? "Falha ao buscar dados")}
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-dvh bg-gradient-to-b from-background via-background to-primary/5 flex flex-col pt-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <Header texto="Meus Anúncios" />
      </div>

      <div className="px-4 mt-6">
        <Tabs defaultValue="publicados" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-12 bg-muted/50 backdrop-blur-sm border border-border/50 shadow-sm">
            <TabsTrigger
              value="publicados"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Publicados
            </TabsTrigger>
            <TabsTrigger
              value="finalizados"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Finalizados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publicados">
            <div className="max-w-sm mx-auto w-full pb-44">
              {publicados.length === 0 && (
                <div className="text-center py-16 space-y-3">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Package className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-base font-medium text-foreground">
                    Nenhum anúncio publicado
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Seus anúncios ativos aparecerão aqui
                  </p>
                </div>
              )}
              <ul className="space-y-4 mt-4">
                {publicados.map((a, idx) => {
                  const thumb = getThumb(a);
                  const publicado = formatDate(getPublicacao(a));
                  return (
                    <li
                      key={a.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        <div className="flex items-start gap-4 p-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border/50">
                            {thumb ? (
                              <Image
                                src={thumb || "/placeholder.svg"}
                                alt={a.titulo}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/anuncio/${a.id}`}
                              className="block group"
                            >
                              <p className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                {a.titulo}
                              </p>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-primary" />
                              Publicado em {publicado}
                            </p>
                          </div>
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
                                className="h-9 w-9 hover:bg-primary/10 transition-all duration-300"
                                onClick={() => setOpenMenuId(a.id)}
                              >
                                <MoreVertical className="h-5 w-5" />
                                <span className="sr-only">Mais ações</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 border shadow-lg"
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/anuncio/editar/${a.id}`)
                                }
                                className="cursor-pointer"
                              >
                                <Pencil className="h-4 w-4 mr-2" /> Editar
                                anúncio
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <div className="px-3 py-2">
                                <span className="text-sm font-semibold block mb-2">
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
                                    className="text-destructive focus:text-destructive cursor-pointer"
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
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="finalizados">
            <div className="max-w-sm mx-auto w-full pb-44">
              {finalizados.length === 0 && (
                <div className="text-center py-16 space-y-3">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <Package className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-base font-medium text-foreground">
                    Nenhum anúncio finalizado
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Anúncios finalizados aparecerão aqui
                  </p>
                </div>
              )}
              <ul className="space-y-4 mt-4">
                {finalizados.map((a, idx) => {
                  const thumb = getThumb(a);
                  const publicado = formatDate(getPublicacao(a));
                  return (
                    <li
                      key={a.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden opacity-75 hover:opacity-100">
                        <div className="flex items-start gap-4 p-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border/50">
                            {thumb ? (
                              <Image
                                src={thumb || "/placeholder.svg"}
                                alt={a.titulo}
                                fill
                                className="object-cover grayscale"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/anuncio/${a.id}`}
                              className="block group"
                            >
                              <p className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                {a.titulo}
                              </p>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                              Publicado em {publicado}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 hover:bg-primary/10 transition-all duration-300"
                              >
                                <MoreVertical className="h-5 w-5" />
                                <span className="sr-only">Mais ações</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 border shadow-lg"
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/anuncio/editar/${a.id}`)
                                }
                                className="cursor-pointer"
                              >
                                <Pencil className="h-4 w-4 mr-2" /> Editar
                                anúncio
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={async () => {
                                  if (
                                    !confirm(
                                      "Excluir este anúncio? Essa ação não pode ser desfeita."
                                    )
                                  )
                                    return;
                                  await del.mutateAsync(a.id);
                                  toast.success("Anúncio excluído com sucesso");
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Excluir
                                anúncio
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
