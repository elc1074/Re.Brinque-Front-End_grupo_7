import { stat } from "fs";
import { z } from "zod";

export const criarAnuncioSchema = z.object({
  UserId: z.number().optional(),
  preco: z.string().optional(),
  titulo: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Máximo 100 caracteres"),
  marca: z.string().optional(),
  condicao: z.enum(["novo", "usado"], {
    message: "Selecione a condição",
  }),
  descricao: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(350, "Máximo 350 caracteres"),
  categoria_id: z
    .number()
    .nullable()
    .refine((val) => val !== null, { message: "Selecione uma categoria" }),
  disponibilizarDoacao: z.boolean(),
  aceitarTrocas: z.boolean(),
  status: z.enum(["ATIVO", "INATIVO"]).optional(),
});

export type CriarAnuncioSchemaType = z.infer<typeof criarAnuncioSchema>;
