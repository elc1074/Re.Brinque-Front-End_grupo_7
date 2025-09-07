"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cadastroSchema } from "@/schema/cadastro-schema";
import { z } from "zod";
import { useCadastro } from "@/hooks/useCadastro";
import { maskTelefone } from "@/lib/maskTelefone";
import { toast } from "sonner";

type CadastroFormValues = z.infer<typeof cadastroSchema>;

export default function CadastroForm() {
  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(cadastroSchema),
  });
  const [showSenha, setShowSenha] = useState(false);
  const router = useRouter();

  const { cadastrar, isPending } = useCadastro();

  async function onSubmit(values: CadastroFormValues) {
    try {
      const data = await cadastrar(values);
      if (data?.message) {
        toast.success(data.message);
        router.push("/login");
      }
      if (data?.error) toast.error(data.error);
    } catch (e: any) {
      toast.error(e.message);
    }
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-sm mx-auto w-full px-4 pb-6 mt-10"
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
          type="tel"
          placeholder="(99) 99999-9999"
          required
          {...register("telefone")}
          onChange={(e) => {
            const masked = maskTelefone(e.target.value);
            setValue("telefone", masked);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
        <div className="relative">
          <Input
            id="senha"
            {...register("senha")}
            type={showSenha ? "text" : "password"}
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
        className="h-12 text-base font-medium fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full px-4"
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
