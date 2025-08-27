"use client";

import { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cadastroSchema } from "@/schema/cadastro-schema";
import type ICadastro from "@/interface/ICadastro";

interface CadastroFormProps {
  /** Dispara após validação OK (opcional) */
  onSuccess?: (data: ICadastro) => void;
};

export default function CadastroForm({ onSuccess }: CadastroFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState<ICadastro>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ICadastro, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = cadastroSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ICadastro, string>> = {};
      result.error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path[0] as keyof ICadastro;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Se passou na validação
    console.log("Cadastro:", form);
    onSuccess?.(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-sm mx-auto w-full px-4 pb-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Digite seu nome"
          value={form.name}
          onChange={handleChange}
          required
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Digite seu e-mail"
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
            placeholder="Crie uma senha"
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
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme sua senha"
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
            aria-label={
              showConfirmPassword
                ? "Ocultar confirmação"
                : "Mostrar confirmação"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <span className="text-sm text-red-500">{errors.confirmPassword}</span>
        )}
      </div>

      <Button type="submit" className="w-full h-12 text-base font-medium">
        Criar conta
      </Button>
    </form>
  );
}
