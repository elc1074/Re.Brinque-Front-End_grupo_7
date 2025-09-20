"use client";

import { useParams, useRouter } from "next/navigation";
import { useAnuncioById } from "@/hooks/useAnuncioById";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/Botoes/Bottom/button-nav";
import ImageCarousel from "@/components/Anuncios/Anuncio-image";
import { useForm, Controller } from "react-hook-form";
import { updateAnuncioRequest, useUpdateAnuncio } from "@/hooks/useAnuncio";
import { criarAnuncioSchema } from "@/schema/criar-anuncio-schema";
import UploadFotos from "@/components/Formularios/Anuncio/UploadFotos";
import { useCloudinaryConfig } from "@/hooks/useCloudinaryConfig";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function AnuncioPage() {
  const { id } = useParams<{ id: string }>();
  const { anuncio, isPending, isError, error } = useAnuncioById(id);
  const router = useRouter();

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
  const condicoes = [
    { value: "NOVO", label: "Novo" },
    { value: "SEMINOVO", label: "Seminovo" },
    { value: "USADO", label: "Usado" },
  ] as const;

  const tipos = [
    { value: "TROCA", label: "Troca" },
    { value: "DOACAO", label: "Doação" },
  ] as const;

  const statuses = [
    { value: "DISPONIVEL", label: "Disponível" },
    { value: "NEGOCIANDO", label: "Negociando" },
    { value: "FINALIZADO", label: "Finalizado" },
  ] as const;

  type CriarAnuncioSchemaType = z.infer<typeof criarAnuncioSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CriarAnuncioSchemaType>({
    resolver: zodResolver(criarAnuncioSchema),
    defaultValues: {
      titulo: anuncio?.titulo ?? "",
      categoria_id: anuncio?.categoria_id ?? undefined,
      marca: anuncio?.marca ?? "",
      condicao: anuncio?.condicao ?? "USADO",
      descricao: anuncio?.descricao ?? "",
      tipo: anuncio?.tipo ?? "TROCA",
      status: anuncio?.status ?? "DISPONIVEL",
      imagens: [],
    },
  });

  useEffect(() => {
    if (anuncio) {
      reset({
        titulo: anuncio.titulo,
        categoria_id: anuncio.categoria_id,
        marca: anuncio.marca ?? "",
        condicao: anuncio.condicao,
        descricao: anuncio.descricao,
        tipo: anuncio.tipo,
        status: anuncio.status,
        imagens: [],
      });
    }
  }, [anuncio, reset]);

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

  async function onSubmit(data: CriarAnuncioSchemaType) {
    const payload = {
      ...data,
      categoria_id: data.categoria_id === null ? undefined : data.categoria_id,
    };
    try {
      const result = await updateAnuncioRequest(id, payload);
      if (result?.error) {
        return toast.error(result.error);
      }
      toast.success("Anúncio atualizado com sucesso!");
      router.push("/tela-inicial");
    } catch (e: any) {
      console.error("Erro ao atualizar anúncio:", e);
      toast.error(e.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-dvh bg-background flex flex-col pt-6">
        {/* Header */}
        <header className="flex justify-between px-6">
          <div className="flex items-center space-x-4">
            <Link href="/perfil">
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

          <div className="space-y-2">
            <Label htmlFor="titulo">Titulo</Label>
            <Input
              id="titulo"
              type="titulo"
              placeholder="Insira um Titulo"
              {...register("titulo")}
              required
              aria-invalid={!!errors.titulo}
              aria-describedby={errors.titulo ? "titulo-error" : undefined}
            />
            {errors.titulo && (
              <span id="titulo-error" className="text-sm text-red-500">
                {errors.titulo.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Marca */}
            <div className="flex-col">
              <Label htmlFor="marca">Marca </Label>
              <Input
                id="marca"
                type="marca"
                placeholder="Insira um marca"
                {...register("marca")}
                aria-invalid={!!errors.marca}
                aria-describedby={errors.marca ? "marca-error" : undefined}
              />
            </div>

            <div className="flex-col">
              <Label htmlFor="condicao">Condição</Label>
              <Controller
                name="condicao"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="condicao">
                      <SelectValue placeholder="Selecione a condição" />
                    </SelectTrigger>
                    <SelectContent>
                      {condicoes.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.condicao && (
                <span id="condicao-error" className="text-sm text-red-500">
                  {errors.condicao.message as string}
                </span>
              )}
            </div>

            <div className="flex-col">
              <Label htmlFor="tipo">Tipo</Label>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipos.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo && (
                <span id="tipo-error" className="text-sm text-red-500">
                  {errors.tipo.message as string}
                </span>
              )}
            </div>

            {/* {anuncio.endereco_completo && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{anuncio.endereco_completo}</span>
          </div>
        )} */}

            {anuncio.categoria_id && (
              <div className="flex-col">
                <Label htmlFor="categoria_id">Categoria</Label>
                <Controller
                  name="categoria_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger id="categoria_id">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.icon} {c.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoria_id && (
                  <span
                    id="categoria_id-error"
                    className="text-sm text-red-500"
                  >
                    {errors.categoria_id.message as string}
                  </span>
                )}
              </div>
            )}

            {/* <div className="flex-col">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <span id="status-error" className="text-sm text-red-500">
                  {errors.status.message as string}
                </span>
              )}
            </div> */}
          </div>
          <p className="font-semibold">Descrição</p>
          <Input
            id="descricao"
            type="descricao"
            placeholder="Insira um descricao"
            {...register("descricao")}
            required
            aria-invalid={!!errors.descricao}
            aria-describedby={errors.descricao ? "descricao-error" : undefined}
          />
          <div>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </div>

        <div className="fixed bottom-0 w-full flex justify-center">
          <BottomNav />
        </div>
      </div>
    </form>
  );
}
