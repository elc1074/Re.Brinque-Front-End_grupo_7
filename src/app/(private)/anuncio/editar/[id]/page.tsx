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

  // const statuses = [
  //   { value: "DISPONIVEL", label: "Disponível" },
  //   { value: "NEGOCIANDO", label: "Negociando" },
  //   { value: "FINALIZADO", label: "Finalizado" },
  // ] as const;

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
    // defaultValues: {
    //   titulo: anuncio?.titulo ?? "",
    //   categoria_id: anuncio?.categoria_id ?? undefined,
    //   marca: anuncio?.marca ?? "",
    //   condicao: anuncio?.condicao ?? "USADO",
    //   descricao: anuncio?.descricao ?? "",
    //   tipo: anuncio?.tipo ?? "TROCA",
    //   status: anuncio?.status ?? "DISPONIVEL",
    //   imagens: [],
    // },
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

  if (!id) return <div className="p-8 text-center">Carregando...</div>;
  if (isPending)
    return <div className="p-8 text-center">Carregando anúncio...</div>;
  if (isError)
    return <div className="p-8 text-center">Erro: {error?.message}</div>;
  if (!anuncio)
    return <div className="p-8 text-center">Anúncio não encontrado.</div>;

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
      <div className="min-h-dvh bg-background flex flex-col pt-6">
        <Header texto="Voltar"/>

        <div className="pt-6 max-w-sm mx-auto w-full pb-44">
          {/* UploadFotos para editar imagens */}
          <div className="mb-4">
            {cloudErr && (
              <span className="text-red-500 text-sm">
                Erro ao carregar config do Cloudinary: {cloudErr}
              </span>
            )}
            {loadingCloud ? (
              <div className="text-sm text-muted-foreground flex items-center">
                <span>
                  <Loader2 className="animate-spin text-primary mr-2" />
                </span>
                Carregando imagens…
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
              <div className="text-sm text-red-500">
                Não foi possível obter as configurações do Cloudinary.
              </div>
            )}
          </div>

          {/* Preview das imagens (opcional) */}
          {/* <div className="aspect-square overflow-hidden">
            <ImageCarousel
              imagens={imagens.map((url) => ({ url_imagem: url }))}
              titulo={anuncio.titulo}
            />
          </div> */}

          <div className="space-y-2 mb-6">
            <Label htmlFor="titulo">Titulo</Label>
            <Input
              id="titulo"
              type="text"
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
            <div className="flex-col space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                type="text"
                placeholder="Insira um marca"
                {...register("marca")}
                aria-invalid={!!errors.marca}
                aria-describedby={errors.marca ? "marca-error" : undefined}
              />
            </div>

            <div className="flex-col space-y-2">
              <Label htmlFor="condicao">Condição</Label>
              <Controller
                name="condicao"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className="data-[size=default]:h-12 rounded-2xl w-[175px]"
                      id="condicao"
                    >
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

            <div className="flex-col space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className="data-[size=default]:h-12 rounded-2xl w-[175px]"
                      id="tipo"
                    >
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
              <div className="flex-col space-y-2">
                <Label htmlFor="categoria_id">Categoria</Label>
                <Controller
                  name="categoria_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value != undefined && field.value !== null ? String(field.value) : undefined}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger
                        className="data-[size=default]:h-12 rounded-2xl w-[175px]"
                        id="categoria_id"
                      >
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

            {/* <div className="flex-col space-y-2">
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
          <Textarea
            id="descricao"
            placeholder="Insira um descricao"
            {...register("descricao")}
            required
            aria-invalid={!!errors.descricao}
            aria-describedby={errors.descricao ? "descricao-error" : undefined}
          />
          <div>
            <Button
              disabled={updateAnuncio.isPending}
              className="w-full h-12 text-base font-medium dark:text-white mt-6"
              type="submit"
            >
              {updateAnuncio.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" /> Salvando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save /> Salvar Alterações
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="fixed bottom-0 w-full flex justify-center">
          <BottomNav />
        </div>
      </div>
    </form>
  );
}
