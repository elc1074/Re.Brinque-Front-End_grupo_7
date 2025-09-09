"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, X } from "lucide-react";
import { useAnuncioMutation } from "@/hooks/useAnuncio";
import z from "zod";
import Link from "next/link";
import {
  criarAnuncioSchema,
} from "@/schema/criar-anuncio-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

type CriarAnuncioSchemaType = z.infer<typeof criarAnuncioSchema>;

export default function CriarAnuncioForm({ usuario_id }: { usuario_id: number }) {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CriarAnuncioSchemaType>({
    resolver: zodResolver(criarAnuncioSchema),
    defaultValues: {
      // ---------------------------- verificar o schema e colocar os valores corretos ---------------------------- //
      // ----------------------------------- depois ajustar os formulários ---------------------------------------- //

      preco: "",
      titulo: "",
      marca: "",
      condicao: undefined,
      descricao: "",
      categoria_id: null,
      disponibilizarDoacao: false,
      aceitarTrocas: false,
      status: "ATIVO",
    },
  });
  const formData = watch();

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const {
    criarAnuncio,
    isPending,
    isSuccess,
    isError,
    error,
    data,
  } = useAnuncioMutation();
  async function onSubmit(values: CriarAnuncioSchemaType) {
    try {
      const payload = {
        ...values,
        usuario_id,
      };
      const result = await criarAnuncio(payload);
      if (result?.message) {
        toast.success(result.message);
        router.push("/tela-inicial");
      }
      if (result?.error) toast.error(result.error);
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Dê um título ao seu anúncio</h2>
            <div className="space-y-2">
              <Input
                placeholder="ex.: Brinquedo Pelúcia Leãozinho"
                {...register("titulo")}
                className="bg-gray-100 border-0 text-lg p-4"
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
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Descreva seu produto</h2>
            <div className="space-y-2">
              <Textarea
                placeholder="ex.: Pelúcia Leãozinho com plush macio, cor marrom clássica, antialérgico e tamanho 25cm"
                {...register("descricao")}
                className="bg-gray-100 border-0 text-lg p-4 min-h-32 resize-none"
                maxLength={350}
              />
              <p className="text-sm text-gray-500">
                {formData.descricao.length} de 350
              </p>
              {errors.descricao && (
                <span className="text-red-500 text-sm">
                  {errors.descricao.message}
                </span>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Selecione a condição de uso</h2>
            <RadioGroup
              value={formData.condicao}
              onValueChange={(value) =>
                setValue("condicao", value as "novo" | "usado")
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="novo" id="novo" />
                <Label htmlFor="novo" className="text-lg">
                  Novo
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="usado" id="usado" />
                <Label htmlFor="usado" className="text-lg">
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
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">
              Escolha a categoria do brinquedo
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  type="button"
                  onClick={() => setValue("categoria_id", categoria.id)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    formData.categoria_id === categoria.id
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-200"
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
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Adicione a marca do produto</h2>
            <Input
              placeholder="ex.: Mattel"
              {...register("marca")}
              className="bg-gray-100 border-0 text-lg p-4"
            />
            <Button
              variant="ghost"
              className="w-full text-gray-600"
              type="button"
              onClick={() => setValue("marca", "")}
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
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">
              Adicione um preço ao anúncio
            </h2>
            <div className="space-y-4">
              <Input
                placeholder="R$"
                {...register("preco")}
                className="bg-gray-100 border-0 text-lg p-4"
              />
              {errors.preco && (
                <span className="text-red-500 text-sm">
                  {errors.preco.message}
                </span>
              )}
              <div className="text-center text-gray-500">ou</div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="doacao"
                    checked={formData.disponibilizarDoacao}
                    onCheckedChange={(checked) =>
                      setValue("disponibilizarDoacao", checked as boolean)
                    }
                  />
                  <div>
                    <Label htmlFor="doacao" className="font-medium">
                      Disponibilizar para doação
                    </Label>
                    <p className="text-sm text-gray-500">
                      Seu produto será gratuito
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="trocas"
                    checked={formData.aceitarTrocas}
                    onCheckedChange={(checked) =>
                      setValue("aceitarTrocas", checked as boolean)
                    }
                  />
                  <div>
                    <Label htmlFor="trocas" className="font-medium">
                      Aceitar trocas
                    </Label>
                    <p className="text-sm text-gray-500">
                      Seu produto será gratuito
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.titulo.trim().length > 0;
      case 2:
        return formData.descricao.trim().length > 0;
      case 3:
        return formData.condicao !== undefined;
      case 4:
        return formData.categoria_id !== null;
      case 5:
        return true;
      case 6:
        return (
          formData.preco ||
          formData.disponibilizarDoacao ||
          formData.aceitarTrocas
        );
      default:
        return false;
    }
  };

  return (
    <form
      className="min-h-screen bg-white flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Header */}
      <header className="flex justify-between px-6">
        <div className="flex items-center space-x-4">
          {step > 1 && (
            <button type="button" onClick={handleBack}>
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-primary">
            Criar anúncio
          </h1>
        </div>
        <Link href="/tela-inicial">
          <Button variant="link" size="icon" type="button">
            <X className="text-zinc-500" />
          </Button>
        </Link>
      </header>

      {/* Progress indicator */}
      <div className="px-4 py-2">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-green-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">{renderStep()}</div>

      {/* Footer */}
      <div className="p-6 border-t">
        <Button
          onClick={step === 6 ? undefined : handleNext}
          disabled={!canProceed() || isPending}
          className="w-full bg-primary text-white py-4 text-lg font-medium"
          type={step === 6 ? "submit" : "button"}
        >
          {isPending
            ? "Criando..."
            : step === 6
            ? "Criar Anúncio"
            : "Continuar"}
        </Button>
      </div>
    </form>
  );
}
