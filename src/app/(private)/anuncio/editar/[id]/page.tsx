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
import { moderarTexto } from "@/lib/moderarTexto";

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
    if (!anuncio) return;

    reset({
      titulo: anuncio.titulo ?? "",
      categoria_id: anuncio.categoria_id ?? "",
      marca: anuncio.marca ?? "",
      condicao: anuncio.condicao ?? "",
      descricao: anuncio.descricao ?? "",
      tipo: anuncio.tipo ?? "",
      status: anuncio.status ?? "",
      imagens: [],
    });

    setImagens(
      Array.isArray(anuncio.imagens)
        ? anuncio.imagens.map((img: any) =>
            typeof img === "string" ? img : img.url_imagem
          )
        : []
    );
  }, [anuncio]);

  async function moderarImagem(file: File) {
    const formData = new FormData();
    formData.append("imagem", file);
    const response = await fetch("https://back-rebrinque.onrender.com/api/moderar-upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Erro ao analisar imagem");
    const data = await response.json();
    return !data.bloqueado;
  }

  async function verificarImagensExistentes(urls: string[]) {
    let bloqueada = false;
    const aprovadas: string[] = [];

    await Promise.all(
      urls.map(async (url) => {
        const blob = await fetch(url).then((res) => res.blob());
        const aprovada = await moderarImagem(new File([blob], "imagem.jpg"));
        if (!aprovada) {
          bloqueada = true;
          toast.error("Uma das imagens foi bloqueada por conter conteúdo impróprio.");
        } else {
          aprovadas.push(url);
        }
      })
    );

    if (bloqueada) return null;
    return aprovadas;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: CriarAnuncioSchemaType) {
    if (isSubmitting || updateAnuncio.isPending) return;
    setIsSubmitting(true);
    try {
      const textoParaModerar = `${data.titulo}\n\n${data.descricao}\n\n${data.marca ?? ""}`;
      const textoAprovado = await moderarTexto(textoParaModerar);

      if (!textoAprovado) {
        toast.error("O texto contém conteúdo impróprio. Revise o anúncio.");
        setIsSubmitting(false);
        return;
      }

      const imagensAprovadas = await verificarImagensExistentes(imagens);

      if (!imagensAprovadas) {
        setIsSubmitting(false);
        return;
      }

      if (imagensAprovadas.length === 0) {
        toast.error("Nenhuma imagem válida foi enviada.");
        setIsSubmitting(false);
        return;
      }

      const imagensPayload = imagensAprovadas.map((url, idx) => ({
        url_imagem: url,
        principal: idx === 0,
      }));

      const payload = {
        ...data,
        categoria_id: data.categoria_id ?? undefined,
        imagens: imagensPayload,
      };

      const result = await updateAnuncio.mutateAsync({ id, data: payload });

      if (result?.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Anúncio atualizado com sucesso!");
      setIsSubmitting(false);
      router.back();
    } catch (e: any) {
      toast.error(e.message || "Erro inesperado ao atualizar o anúncio.");
      setIsSubmitting(false);
    }
  }

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
          <p className="text-destructive font-medium">Erro ao carregar anúncio</p>
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
              <Label htmlFor="titulo" className="text-base font-medium">Título</Label>
              <Input id="titulo" type="text" className="h-12 rounded-xl" {...register("titulo")} required />
              {errors.titulo && <span className="text-sm text-red-500">{errors.titulo.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marca" className="text-base font-medium">Marca</Label>
                <Input id="marca" type="text" className="h-12 rounded-xl" {...register("marca")} />
                {errors.marca && <span className="text-sm text-red-500">{errors.marca.message}</span>}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Condição</Label>
                <Controller
                  name="condicao"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {condicoes.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.condicao && <span className="text-sm text-red-500">{errors.condicao.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Tipo</Label>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {tipos.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tipo && <span className="text-sm text-red-500">{errors.tipo.message}</span>}
              </div>

              {anuncio.categoria_id && (
                <div className="space-y-2">
                  <Label className="text-base font-medium">Categoria</Label>
                  <Controller
                    name="categoria_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value != null ? String(field.value) : undefined}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
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
                    <span className="text-sm text-red-500">{errors.categoria_id.message}</span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-base font-medium">Descrição</Label>
              <Textarea id="descricao" className="min-h-[120px] rounded-xl resize-none" {...register("descricao")} required />
              {errors.descricao && <span className="text-sm text-red-500">{errors.descricao.message}</span>}
            </div>
          </div>

          <Button
            disabled={isSubmitting || updateAnuncio.isPending}
            className="w-full h-14 text-base font-semibold dark:text-white mt-6 rounded-xl shadow-lg"
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
