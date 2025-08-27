import { z } from "zod";

export const cadastroSchema = z
  .object({
    name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
    email: z.email({ message: "E-mail inválido" }),
    password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type CadastroSchema = z.infer<typeof cadastroSchema>;
