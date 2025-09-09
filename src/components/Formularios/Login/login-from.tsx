"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLoginButton from "@/components/Botoes/Login/google-login-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/schema/login-schema";
import { useLogin } from "@/hooks/useLogin";
import { toast } from "sonner";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showSenha, setShowSenha] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" }
  });

  const { login, isPending } = useLogin();

  async function onSubmit(values: LoginFormValues) {
    try {
      const data = await login(values);
      if (data?.message) {
        toast.success(data.message);
        // Salvar dados nos cookies
        const cookieResponse = await fetch("/api/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: data.token,
            id: data.usuario?.id,
            nome: data.usuario?.nome,
            email: data.usuario?.email,
          }),
        });
        if (!cookieResponse.ok) {
          throw new Error("Erro ao definir o cookie");
        }
        router.push("/tela-inicial");
      }
      if (data?.error) toast.error(data.error);
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao fazer login.");
    }
  }

  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-sm mx-auto w-full px-4 pb-6 mt-10"
      >
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="Insira seu e-mail"
            {...register("email")}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="text-sm text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <div className="relative">
            <Input
              id="senha"
              type={showSenha ? "text" : "password"}
              placeholder="**********"
              {...register("senha")}
              required
              aria-invalid={!!errors.senha}
              aria-describedby={errors.senha ? "senha-error" : undefined}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowSenha((v) => !v)}
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

        <div className="text-right">
          <Button
            variant="link"
            className="text-sm text-primary hover:underline"
            onClick={() => toast.warning("Funcionalidade em desenvolvimento")}
          >
            Esqueci a senha
          </Button>
        </div>

        <div className="pt-8">
          <GoogleLoginButton />
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
              Entrando...
            </>
          ) : (
            "Acessar"
          )}
        </Button>
      </form>
  );
}
