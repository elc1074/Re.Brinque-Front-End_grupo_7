import { z } from "zod";


export const esqueciSenhaSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type esqueciSenhaSchema = z.infer<typeof esqueciSenhaSchema>;
