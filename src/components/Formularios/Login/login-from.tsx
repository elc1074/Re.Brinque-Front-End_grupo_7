"use client";

import React, { useState } from "react";
import { loginSchema } from "@/schema/login-schema";
import type ILogin from "@/interface/ILogin";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginButton from "@/components/Botoes/Login/login-button";
import GoogleLoginButton from "@/components/Botoes/Login/google-login-button";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<ILogin>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ILogin, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ILogin, string>> = {};
      result.error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path[0] as keyof ILogin;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    // Se passou na validação
    console.log("Login attempt:", form);
  };

  return (
      <div className="flex-1 p-4 mt-4">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Insira seu e-mail"
              value={form.email}
              onChange={handleChange}
              required
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Insira sua senha"
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
          </div>
          <div className="text-right">
            <Link
              href="/esqueci-senha"
              className="text-sm text-primary hover:underline"
            >
              Esqueci a senha
            </Link>
          </div>

          <GoogleLoginButton />

          {/* Botão Login */}
          <LoginButton texto="Acessar"/>
        </form>

      </div>
  );
}