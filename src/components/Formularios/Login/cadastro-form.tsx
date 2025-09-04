"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cadastroSchema } from "@/schema/cadastro-schema";
import { z } from "zod";
import { useCadastro } from "@/hooks/useCadastro";
import { toast } from "sonner";

type CadastroFormValues = z.infer<typeof cadastroSchema>;

export default function CadastroForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(cadastroSchema),
  });
  const [showSenha, setShowSenha] = useState(false);

const { cadastrar, isPending } = useCadastro();

async function onSubmit(values: CadastroFormValues) {
  try {
    const data = await cadastrar(values);
    if (data?.message) toast.success(data.message);
    if (data?.error) toast.error(data.error);
  } catch (e: any) {
    toast.error(e.message);
  }
}


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-sm mx-auto w-full px-4 pb-6"
    >
      <div className="space-y-2">
        <Label htmlFor="nome_completo">Nome</Label>
        <Input
          id="nome_completo"
          {...register("nome_completo")}
          type="text"
          placeholder="Digite seu nome"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          {...register("email")}
          type="email"
          placeholder="Digite seu e-mail"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          {...register("telefone")}
          type="tel"
          placeholder="(99) 99999-9999"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
        <div className="relative">
          <Input
            id="senha"
            {...register("senha")}
            type={showSenha ? "text" : "senha"}
            placeholder="**********"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowSenha(!showSenha)}
            aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            {showSenha ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando…
            </>
          ) : (
            "Criar conta"
          )}
        </Button>

    </form>
  );
}
