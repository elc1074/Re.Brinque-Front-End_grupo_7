
import { z } from "zod";

export const loginSchema = z.object({
	email: z.email({ message: "E-mail inválido" }),
	password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
