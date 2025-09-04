
import { z } from "zod";

export const loginSchema = z.object({
	email: z.email({ message: "E-mail inválido" }),
	senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
