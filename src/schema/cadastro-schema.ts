import { z } from "zod";

export const cadastroSchema = z.object({
  nome_completo: z
    .string()
    .min(5, { message: "O nome deve ter pelo menos 5 caracteres" }),
  email: z.email({ message: "E-mail inválido" }),
  telefone: z.string().min(10, { message: "Informe um telefone válido" }),
  senha: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export type CadastroSchema = z.infer<typeof cadastroSchema>;