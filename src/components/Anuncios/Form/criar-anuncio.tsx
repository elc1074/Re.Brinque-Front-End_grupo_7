"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, X } from "lucide-react";
import { useAnuncioMutation } from "@/hooks/useAnuncio";
import type { z } from "zod";
import Link from "next/link";
import { criarAnuncioSchema } from "@/schema/criar-anuncio-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PreviewFotos from "./preview-image";
import { useCloudinaryConfig } from "@/hooks/useCloudinaryConfig";
import { moderarTexto } from "@/lib/moderarTexto";


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

// Modificar o schema para aceitar arquivos locais no frontend
type CriarAnuncioFormType = Omit<z.infer<typeof criarAnuncioSchema>, "imagens">;

export default function CriarAnuncioForm({
  usuario_id,
}: {
  usuario_id: number;
}) {
  const [step, setStep] = useState(1);
  const [arquivos, setArquivos] = useState<File[]>([]);
  const router = useRouter();
  const { config } = useCloudinaryConfig();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CriarAnuncioFormType>({
    resolver: zodResolver(criarAnuncioSchema.omit({ imagens: true })),
    defaultValues: {
      categoria_id: null,
      titulo: "",
      marca: null,
      condicao: undefined,
      descricao: "",
      status: "DISPONIVEL",
      tipo: undefined,
    },
  });

  const formData = watch();

  const moderarImagem = async (file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append("imagem", file);

    const response = await fetch(
      "https://back-rebrinque.onrender.com/api/moderar-upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Erro ao analisar imagem");

    const data = await response.json();
    return !data.bloqueado; // true se aprovada
  };

  // Função para fazer upload das imagens
  const uploadImagens = async (
    files: File[]
  ): Promise<Array<{ url_imagem: string; principal: boolean }> | null> => {
    if (!config) {
      toast.error("Configuração do Cloudinary não disponível");
      return null;
    }

    const resultados: Array<{ url_imagem: string; principal: boolean }> = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const aprovada = await moderarImagem(file);

      if (!aprovada) {
        toast.error(`Imagem ${index + 1} bloqueada por conteúdo impróprio`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // espera 1 segundo
        return null;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", config.uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error(`Erro no upload da imagem ${index + 1}`);
        return null;
      }

      const data = await response.json();
      resultados.push({
        url_imagem: data.secure_url,
        principal: index === 0,
      });
    }

    return resultados;
  };

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const { criarAnuncio, isPending } = useAnuncioMutation();
  const storedLocation = localStorage.getItem("userLocation");
  console.log("Location usada no anúncio:", storedLocation);

  const onSubmit = async (values: CriarAnuncioFormType): Promise<void> => {
    try {
      const textoParaModerar = `${values.titulo}\n\n${values.descricao}\n\n${values.marca ?? ""}`;
      const textoAprovado = await moderarTexto(textoParaModerar);

      if (!textoAprovado) {
        toast.error("Algum campo contém conteúdo impróprio. Revise o texto digitado.");
        setStep(2); // volta para etapa de texto
        return;
      }

      toast.loading("Analisando imagens...");

      const imagens = await uploadImagens(arquivos);

      toast.dismiss();

      if (!imagens || imagens.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // espera o toast aparecer
        setStep(1); // volta para etapa de upload
        return;
      }

      toast.loading("Criando anúncio...");

      let location = { latitude: 0, longitude: 0 };
      if (typeof window !== "undefined") {
        const storedLocation = localStorage.getItem("userLocation");
        if (storedLocation) {
          try {
            const parsedLocation = JSON.parse(storedLocation);
            if (parsedLocation.latitude && parsedLocation.longitude) {
              location = parsedLocation;
            }
          } catch (e) {
            console.error("Falha ao analisar userLocation do localStorage", e);
          }
        }
      }

      const payload = {
        ...values,
        usuario_id,
        categoria_id: values.categoria_id as number,
        marca: values.marca !== undefined ? values.marca : null,
        tipo:
          values.tipo === "TROCA" || values.tipo === "DOACAO"
            ? values.tipo
            : "TROCA",
        imagens,
        location,
      };

      const result = await criarAnuncio(payload);

      toast.dismiss();

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Anúncio criado com sucesso!");
      router.push("/tela-inicial");
    } catch (e: any) {
      toast.dismiss();
      console.error("Erro ao criar anúncio:", e);
      toast.error(e.message || "Erro ao criar anúncio");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-2">
            <Label className="text-lg font-medium">Fotos do produto</Label>
            <PreviewFotos value={arquivos} onChange={setArquivos} max={6} />
            {arquivos.length === 0 && (
              <span className="text-red-500 text-sm">
                Adicione pelo menos uma foto do produto
              </span>
            )}
          </div>
        );
      // ...existing code... (cases 2-7 permanecem iguais)
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg">Dê um título ao seu anúncio</Label>
              <Input
                placeholder="ex.: Brinquedo Pelúcia Leãozinho"
                {...register("titulo")}
                className="bg-gray-100 text-lg p-4"
                maxLength={100}
              />
              <p className="text-sm text-gray-500">
                {formData.titulo.length} de 100
              </p>
              {errors.titulo && (
                <span className="text-red-500 text-sm">
                  {errors.titulo.message}
                </span>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <Label className="text-lg font-medium">Descreva seu produto</Label>
            <div className="space-y-2">
              <Textarea
                placeholder="ex.: Pelúcia Leãozinho com plush macio, cor marrom clássica, antialérgico e tamanho 25cm"
                {...register("descricao")}
                className="bg-gray-100 text-lg p-4 min-h-32 resize-none"
                maxLength={244}
              />
              <p className="text-sm text-gray-500">
                {formData.descricao.length} de 244
              </p>
              {errors.descricao && (
                <span className="text-red-500 text-sm">
                  {errors.descricao.message}
                </span>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <Label className="text-lg font-medium">
              Selecione a condição de uso
            </Label>
            <RadioGroup
              value={formData.condicao}
              onValueChange={(value) =>
                setValue("condicao", value as "NOVO" | "USADO", {
                  shouldValidate: true,
                })
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg dark:border-primary">
                <RadioGroupItem value="NOVO" id="condicao-novo" />
                <Label htmlFor="condicao-novo" className="text-lg">
                  Novo
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg dark:border-primary">
                <RadioGroupItem value="USADO" id="condicao-usado" />
                <Label htmlFor="condicao-usado" className="text-lg">
                  Usado
                </Label>
              </div>
            </RadioGroup>
            {errors.condicao && (
              <span className="text-red-500 text-sm">
                {errors.condicao.message}
              </span>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <Label className="text-lg font-medium">
              Escolha a categoria do brinquedo
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  type="button"
                  onClick={() =>
                    setValue("categoria_id", categoria.id, {
                      shouldValidate: true,
                    })
                  }
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    formData.categoria_id === categoria.id
                      ? "bg-green-50 border-green-500 dark:bg-green-900/30 dark:border-green-700"
                      : "bg-gray-50 border-gray-200 dark:bg-zinc-800 dark:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{categoria.icon}</span>
                    <span className="font-medium">{categoria.nome}</span>
                  </div>
                </button>
              ))}
            </div>
            {errors.categoria_id && (
              <span className="text-red-500 text-sm">
                {errors.categoria_id.message}
              </span>
            )}
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <Label className="text-lg font-medium">
              Adicione a marca do produto
            </Label>
            <Input
              placeholder="ex.: Mattel"
              {...register("marca")}
              className="bg-gray-100 text-lg p-4"
            />
            <Button
              variant="ghost"
              className="w-full text-gray-600"
              type="button"
              onClick={() => setValue("marca", null)}
            >
              Sem marca
            </Button>
            {errors.marca && (
              <span className="text-red-500 text-sm">
                {errors.marca.message}
              </span>
            )}
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <Label className="text-lg font-medium">
              Selecione o tipo do anúncio
            </Label>
            <RadioGroup
              value={formData.tipo}
              onValueChange={(value) =>
                setValue("tipo", value as "TROCA" | "DOACAO", {
                  shouldValidate: true,
                })
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg dark:border-primary">
                <RadioGroupItem value="TROCA" id="tipo-troca" />
                <Label htmlFor="tipo-troca" className="text-lg">
                  Troca
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg dark:border-primary">
                <RadioGroupItem value="DOACAO" id="tipo-doacao" />
                <Label htmlFor="tipo-doacao" className="text-lg">
                  Doação
                </Label>
              </div>
            </RadioGroup>
            {errors.tipo && (
              <span className="text-red-500 text-sm">
                {errors.tipo.message}
              </span>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return arquivos.length > 0;
      case 2:
        return formData.titulo.trim().length > 0;
      case 3:
        return formData.descricao.trim().length > 0;
      case 4:
        return formData.condicao !== undefined;
      case 5:
        return formData.categoria_id !== null;
      case 6:
        return true;
      case 7:
        return formData.tipo === "TROCA" || formData.tipo === "DOACAO";
      default:
        return formData.tipo === "TROCA" || formData.tipo === "DOACAO";
    }
  };

  return (
    <form
      className="min-h-dvh bg-background flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Header */}
      <header className="flex justify-between px-6">
        <div className="flex items-center space-x-4">
          {step > 1 && (
            <button type="button" onClick={handleBack}>
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-primary">
            Criar anúncio
          </h1>
        </div>
        <Link href="/tela-inicial">
          <Button variant="link" size="icon" type="button">
            <X className="!size-5 text-zinc-500 dark:text-white" />
          </Button>
        </Link>
      </header>

      {/* Progress indicator */}
      <div className="px-4 py-2">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-green-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">{renderStep()}</div>

      {/* Footer */}
      <div className="p-6">
        {step === 7 ? (
          <Button
            disabled={!canProceed() || isPending}
            className="w-full h-12 text-base font-medium dark:text-white mb-4"
            type="submit"
          >
            {isPending ? "Criando..." : "Criar Anúncio"}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isPending}
            className="w-full h-12 text-base font-medium dark:text-white mb-4"
            type="button"
          >
            Continuar
          </Button>
        )}
      </div>
    </form>
  );
}
