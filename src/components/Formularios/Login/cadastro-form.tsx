"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cadastroSchema } from "@/schema/cadastro-schema";
import { maskTelefone } from "@/lib/maskTelefone";
import { useCadastro } from "@/hooks/useCadastro";
import type ICadastro from "@/interface/ICadastro";
import { z } from "zod";

export default function CadastroForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<ICadastro>({
    nome_completo: "",
    email: "",
    telefone: "",
    senha: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ICadastro, string>>
  >({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "telefone") {
      setForm({ ...form, telefone: maskTelefone(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError("");
    setSuccess("");

    const result = cadastroSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ICadastro, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ICadastro;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const res = await useCadastro(
      form.nome_completo,
      form.email,
      form.telefone,
      form.senha
    );
    if (res.message) {
      setSuccess(res.message);
      setForm({ nome_completo: "", email: "", telefone: "", senha: "" });
    } else {
      setError(res.error || "Erro ao cadastrar");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-sm mx-auto w-full px-4 pb-6"
    >
      <div className="space-y-2">
        <Label htmlFor="nome_completo">Nome</Label>
        <Input
          id="nome_completo"
          name="nome_completo"
          type="text"
          placeholder="Digite seu nome"
          value={form.nome_completo}
          onChange={handleChange}
          required
          aria-invalid={!!errors.nome_completo}
        />
        {errors.nome_completo && (
          <span className="text-sm text-red-500">{errors.nome_completo}</span>
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
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          name="telefone"
          type="tel"
          placeholder="(99) 99999-9999"
          value={form.telefone}
          onChange={handleChange}
          required
          aria-invalid={!!errors.telefone}
        />
        {errors.telefone && (
          <span className="text-sm text-red-500">{errors.telefone}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="senha"
            name="senha"
            type={showPassword ? "text" : "password"}
            placeholder="Crie uma senha"
            value={form.senha}
            onChange={handleChange}
            required
            aria-invalid={!!errors.senha}
            autoComplete="new-password"
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
        {errors.senha && (
          <span className="text-sm text-red-500">{errors.senha}</span>
        )}
      </div>

      {/* <div className="space-y-2">
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
      </div> */}

      {error && (
        <div className="text-sm text-red-500" role="alert">{error}</div>
      )}
      {success && (
        <div className="text-sm text-green-600" role="status">{success}</div>
      )}

      <Button type="submit" className="w-full h-12 text-base font-medium">
        Criar conta
      </Button>
    </form>
  );
}
