"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

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
    defaultValues: { email: "", senha: "" },
  });

  const { login, isPending } = useLogin();

  async function onSubmit(values: LoginFormValues) {
    try {
      const data = await login(values);

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.message) {
        toast.success(data.message);

        const cookieResponse = await fetch("/api/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: data.token,
            id: data.usuario?.id,
            nome: data.usuario?.nome,
            email: data.usuario?.email,
            auth_type: data.auth_type,
          }),
        });

        if (!cookieResponse.ok) {
          throw new Error("Erro ao definir o cookie");
        }

        router.push("/tela-inicial");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao fazer login.");
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-border/50 backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">
          Bem-vindo de volta!
        </CardTitle>
        <CardDescription className="text-base">
          Entre com sua conta para continuar
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Insira seu e-mail"
                className="pl-10"
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="senha"
                type={showSenha ? "text" : "password"}
                placeholder="**********"
                className="pl-10"
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

          <Button
            type="submit"
            className="w-full h-11 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
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

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>
        <GoogleLoginButton />
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-sm">
        <p className="text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href="/cadastro"
            className="text-primary hover:underline font-semibold"
          >
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
