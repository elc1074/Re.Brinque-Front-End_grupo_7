"use client";

import type React from "react";
import { useState } from "react";
import { esqueciSenhaSchema } from "@/schema/esqueci-senha-schema";
import type IEsqueciSenha from "@/interface/IEsqueciSenha";
import { z } from "zod";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<IEsqueciSenha>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof IEsqueciSenha, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = esqueciSenhaSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof IEsqueciSenha, string>> = {};
      result.error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path[0] as keyof IEsqueciSenha;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    // Se passou na validação
    console.log("Password reset:", form);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/login">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="ml-4 text-2xl font-semibold">Alterar minha senha</h1>
      </div>

      {/* Form */}
      <div className="flex-1 p-4 mt-4">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto">
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Crie sua senha"
                value={form.password}
                onChange={handleChange}
                required
                aria-invalid={!!errors.password}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password}</span>
            )}
            <p className="text-xs text-muted-foreground">
              Deve conter no mínimo 8 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Insira sua senha novamente"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                aria-invalid={!!errors.confirmPassword}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </form>
      </div>

      <form
        className="w-full max-w-sm mx-auto px-4 pb-6 bg-white"
        onSubmit={handleSubmit}
      >
        <Button type="submit" className="w-full h-12 text-base font-medium">
          Enviar nova senha
        </Button>
      </form>
    </div>
  );
}
