"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Phone, User } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { moderarTexto } from "@/lib/moderarTexto";

type CadastroFormValues = z.infer<typeof cadastroSchema>;

export default function CadastroForm() {
  const [showSenha, setShowSenha] = useState(false);
  const router = useRouter();
  const { cadastrar, isPending } = useCadastro();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { nome_completo: "", email: "", telefone: "", senha: "" },
  });

  async function onSubmit(values: CadastroFormValues) {
    const nomeAprovado = await moderarTexto(values.nome_completo);

    if (!nomeAprovado) {
      toast.error("Nome contém conteúdo impróprio. Por favor, escolha outro.");
      return;
    }

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
    <Card className="w-full max-w-md shadow-xl border-border/50 backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">Criar conta</CardTitle>
        <CardDescription className="text-base">
          Preencha os dados para começar
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium">
              Nome completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="nome_completo"
                {...register("nome_completo")}
                type="text"
                placeholder="Digite seu nome"
                required
                className="pl-10"
                aria-invalid={!!errors.nome_completo}
                aria-describedby={
                  errors.nome_completo ? "nome_completo-error" : undefined
                }
              />
            </div>
            {errors.nome_completo && (
              <span id="nome_completo-error" className="text-sm text-red-500">
                {errors.nome_completo.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Digite seu e-mail"
                required
                className="pl-10"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <span id="email-error" className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-sm font-medium">
              Telefone
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="telefone"
                type="tel"
                placeholder="(99) 99999-9999"
                required
                className="pl-10"
                {...register("telefone")}
                onChange={(e) => {
                  const masked = maskTelefone(e.target.value);
                  setValue("telefone", masked);
                }}
                aria-invalid={!!errors.telefone}
                aria-describedby={
                  errors.telefone ? "telefone-error" : undefined
                }
              />
            </div>
            {errors.telefone && (
              <span id="telefone-error" className="text-sm text-red-500">
                {errors.telefone.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="senha"
                {...register("senha")}
                type={showSenha ? "text" : "password"}
                placeholder="**********"
                required
                className="pl-10"
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
            {errors.senha && (
              <span id="senha-error" className="text-sm text-red-500">
                {errors.senha.message}
              </span>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-11 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
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
      </CardContent>

      <CardFooter className="flex justify-center text-sm">
        <p className="text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-semibold"
          >
            Faça login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
