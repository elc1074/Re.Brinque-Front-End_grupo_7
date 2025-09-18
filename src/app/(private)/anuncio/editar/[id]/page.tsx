"use client";

import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAnuncioById } from "@/hooks/useAnuncioById";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Form = {
  titulo: string;
  tipo?: "VENDA" | "DOACAO";
  condicao?: "NOVO" | "SEMINOVO" | "USADO";
  descricao?: string;
};

export default function EditarAnuncioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { anuncio, isPending, isError, error } = useAnuncioById(id);
  const { register, handleSubmit, reset } = useForm<Form>();
  const URL_API = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof document !== "undefined"
      ? document.cookie.match(/token=([^;]+)/)?.[1]
      : undefined;

  useEffect(() => {
    if (anuncio) {
      reset({
        titulo: anuncio.titulo,
        tipo: anuncio.tipo === "TROCA" ? undefined : anuncio.tipo,
        condicao: anuncio.condicao,
        descricao: anuncio.descricao ?? "",
      });
    }
  }, [anuncio, reset]);

  async function onSubmit(data: Form) {
    

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${URL_API}/api/anuncios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      alert("Falha ao salvar");
      return;
    }
    router.push(`/anuncio/${id}`);
  }

  if (isPending) return <div className="p-6">Carregando...</div>;
  if (isError)
    return <div className="p-6">Erro: {String(error?.message ?? "falha")}</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Editar anúncio</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="titulo">Título</Label>
          <Input id="titulo" {...register("titulo", { required: true })} />
        </div>

        <div>
          <Label htmlFor="preco"></Label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <select
              id="tipo"
              className="w-full border rounded-md h-10 px-3"
              {...register("tipo")}
            >
              <option value="VENDA">VENDA</option>
              <option value="DOACAO">DOAÇÃO</option>
            </select>
          </div>
          <div>
            <Label htmlFor="condicao">Condição</Label>
            <select
              id="condicao"
              className="w-full border rounded-md h-10 px-3"
              {...register("condicao")}
            >
              <option value="NOVO">NOVO</option>
              <option value="SEMINOVO">SEMINOVO</option>
              <option value="USADO">USADO</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea id="descricao" rows={5} {...register("descricao")} />
        </div>

        <div className="pt-2 flex gap-3">
          <Button type="submit">Salvar</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
