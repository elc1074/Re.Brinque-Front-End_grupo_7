import { z } from "zod";

export const cadastroSchema = z
  .object({
    nome_completo: z
      .string()
      .min(5, { message: "O nome deve ter pelo menos 5 caracteres" }),
    email: z.email({ message: "E-mail inválido" }),
    telefone: z
      .string()
      .min(10, { message: "Informe um telefone válido" }),
    senha: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    // confirmPassword: z
    //   .string()
    //   .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  })
  // .refine((data) => data.password === data.confirmPassword, {
  //   message: "As senhas não coincidem",
  //   path: ["confirmPassword"],
  // });

export type CadastroSchema = z.infer<typeof cadastroSchema>;

