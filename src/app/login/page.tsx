"use client";

import type React from "react";
import { useState, useRef, useState as useReactState } from "react";
import { loginSchema } from "@/schema/login-schema";
import type ILogin from "@/interface/ILogin";
import { z } from "zod";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<ILogin>({ email: "", password: "" });
  const [errors, setErrors] = useReactState<
    Partial<Record<keyof ILogin, string>>
  >({});

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <Link href="/">
          <Button variant="ghost" size="icon" asChild>
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="ml-4 text-2xl font-semibold">Acessar conta</h1>
      </div>

      {/* Form */}
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
        </form>
      </div>

      <form
        className="w-full max-w-sm mx-auto px-4 pb-6 bg-white"
        onSubmit={handleSubmit}
      >
        <Button type="submit" className="w-full h-12 text-base font-medium">
          Acessar
        </Button>
      </form>
    </div>
  );
}
