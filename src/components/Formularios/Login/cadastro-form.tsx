"use client";

import { use, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cadastroSchema } from "@/schema/cadastro-schema";
import { z } from "zod";
import { useCadastro } from "@/hooks/useCadastro";

type cadastroSchema = z.infer<typeof cadastroSchema>;

export default function CadastroForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(cadastroSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  function handleCadastro(data: cadastroSchema) {
    useCadastro(data.nome_completo, data.email, data.telefone, data.senha);
  }

  return (
    <form
      onSubmit={handleSubmit(handleCadastro)}
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
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="senha"
            {...register("senha")}
            type={showPassword ? "text" : "password"}
            placeholder="**********"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base font-medium">
        Criar conta
      </Button>
    </form>
  );
}
