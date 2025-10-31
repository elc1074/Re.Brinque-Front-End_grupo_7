"use client";

import { useParams, useRouter } from "next/navigation";
import { useAnuncioById } from "@/hooks/useAnuncioById";
import { Loader2, Save } from "lucide-react";
import BottomNav from "@/components/Botoes/Bottom/button-nav";
import { useForm, Controller } from "react-hook-form";
import { useUpdateAnuncio } from "@/hooks/useAnuncio";
import { criarAnuncioSchema } from "@/schema/criar-anuncio-schema";
import UploadFotos from "@/components/Anuncios/Form/UploadFotos";
import { useCloudinaryConfig } from "@/hooks/useCloudinaryConfig";
import { toast } from "sonner";
import type { z } from "zod";
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
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Headers/header";

export default function AnuncioPage() {
  const { id } = useParams<{ id: string }>();
  const { anuncio, isPending, isError, error } = useAnuncioById(id);
  const updateAnuncio = useUpdateAnuncio();
  const [imagens, setImagens] = useState<string[]>([]);
  const router = useRouter();
  const {
    config: cloudConfig,
    loading: loadingCloud,
    error: cloudErr,
  } = useCloudinaryConfig();

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
    { value: "USADO", label: "Usado" },
  ];

  const tipos = [
    { value: "TROCA", label: "Troca" },
    { value: "DOACAO", label: "Doação" },
  ];

  type CriarAnuncioSchemaType = z.infer<typeof criarAnuncioSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CriarAnuncioSchemaType>({
    resolver: zodResolver(criarAnuncioSchema),
  });

  useEffect(() => {
    const imgs = imagens.map((url, idx) => ({
      url_imagem: url,
      principal: idx === 0,
    }));
    setValue("imagens", imgs, { shouldValidate: true, shouldDirty: true });
  }, [imagens, setValue]);

  useEffect(() => {
    if (anuncio && anuncio.condicao && anuncio.tipo && anuncio.categoria_id) {
      setTimeout(() => {
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
        setImagens(
          Array.isArray(anuncio.imagens)
            ? anuncio.imagens
                .map((img: any) =>
                  typeof img === "string" ? img : img.url_imagem
                )
                .filter((url: any) => typeof url === "string")
            : []
        );
      }, 0);
    }
  }, [anuncio, reset]);

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

  async function onSubmit(data: CriarAnuncioSchemaType) {
    const imagensPayload = imagens.map((url, idx) => ({
      url_imagem: url,
      principal: idx === 0,
    }));
    const payload = {
      ...data,
      categoria_id: data.categoria_id === null ? undefined : data.categoria_id,
      imagens: imagensPayload,
    };
    try {
      const result = await updateAnuncio.mutateAsync({ id, data: payload });
      if (result?.error) {
        return toast.error(result.error);
      }
      toast.success("Anúncio atualizado com sucesso!");
      router.back();
    } catch (e: any) {
      console.error("Erro ao atualizar anúncio:", e);
      toast.error(e.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-dvh bg-gradient-to-b from-background via-background to-primary/5 flex flex-col pt-6">
        <Header texto="Voltar" />

        <div className="pt-6 max-w-sm mx-auto w-full pb-44 px-4">
          <div className="mb-6 bg-card rounded-2xl p-4 shadow-md border border-border/50">
            <h2 className="text-lg font-semibold mb-3">Fotos do Anúncio</h2>
            {cloudErr && (
              <span className="text-red-500 text-sm block mb-2">
                Erro ao carregar config do Cloudinary: {cloudErr}
              </span>
            )}
            {loadingCloud ? (
              <div className="text-sm text-muted-foreground flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-primary mr-2 h-5 w-5" />
                <span>Carregando imagens…</span>
              </div>
            ) : cloudConfig ? (
              <UploadFotos
                cloudName={cloudConfig.cloudName}
                value={imagens}
                uploadPreset={cloudConfig.uploadPreset}
                apiKey={cloudConfig.apiKey}
                onChange={setImagens}
                max={6}
              />
            ) : (
              <div className="text-sm text-red-500 text-center py-4">
                Não foi possível obter as configurações do Cloudinary.
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-md border border-border/50 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-base font-medium">
                Título
              </Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Ex: Carrinho Hot Wheels Azul"
                className="h-12 rounded-xl"
                {...register("titulo")}
                required
                aria-invalid={!!errors.titulo}
                aria-describedby={errors.titulo ? "titulo-error" : undefined}
              />
              {errors.titulo && (
                <span
                  id="titulo-error"
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  {errors.titulo.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marca" className="text-base font-medium">
                  Marca
                </Label>
                <Input
                  id="marca"
                  type="text"
                  placeholder="Ex: Mattel"
                  className="h-12 rounded-xl"
                  {...register("marca")}
                  aria-invalid={!!errors.marca}
                  aria-describedby={errors.marca ? "marca-error" : undefined}
                />
                {errors.marca && (
                  <span id="marca-error" className="text-sm text-red-500">
                    {errors.marca.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="condicao" className="text-base font-medium">
                  Condição
                </Label>
                <Controller
                  name="condicao"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-12 rounded-xl" id="condicao">
                        <SelectValue placeholder="Selecione" />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-base font-medium">
                  Tipo
                </Label>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-12 rounded-xl" id="tipo">
                        <SelectValue placeholder="Selecione" />
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

              {anuncio.categoria_id && (
                <div className="space-y-2">
                  <Label
                    htmlFor="categoria_id"
                    className="text-base font-medium"
                  >
                    Categoria
                  </Label>
                  <Controller
                    name="categoria_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={
                          field.value != undefined && field.value !== null
                            ? String(field.value)
                            : undefined
                        }
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger
                          className="h-12 rounded-xl"
                          id="categoria_id"
                        >
                          <SelectValue placeholder="Selecione" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-base font-medium">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o brinquedo, seu estado e detalhes importantes..."
                className="min-h-[120px] rounded-xl resize-none"
                {...register("descricao")}
                required
                aria-invalid={!!errors.descricao}
                aria-describedby={
                  errors.descricao ? "descricao-error" : undefined
                }
              />
              {errors.descricao && (
                <span id="descricao-error" className="text-sm text-red-500">
                  {errors.descricao.message}
                </span>
              )}
            </div>
          </div>

          <Button
            disabled={updateAnuncio.isPending}
            className="w-full h-14 text-base font-semibold dark:text-white mt-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            type="submit"
          >
            {updateAnuncio.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" /> Salvando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-5 w-5" /> Salvar Alterações
              </span>
            )}
          </Button>
        </div>

        <div className="fixed bottom-0 w-full flex justify-center">
          <BottomNav />
        </div>
      </div>
    </form>
  );
}
