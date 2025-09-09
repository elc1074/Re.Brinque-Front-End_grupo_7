import { stat } from "fs";
import { TimePrecision, z } from "zod";

export const criarAnuncioSchema = z.object({
  usuario_id: z.number().optional(),
  titulo: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Máximo 100 caracteres"),
  marca: z.string().optional(),
  descricao: z
  .string()
  .min(1, "Descrição é obrigatória")
  .max(254, "Máximo 254 caracteres"),
  tipo: z.enum(["TROCA", "DOACAO"], {
    message: "Selecione o tipo do anúncio",
  }),
  condicao: z.enum(["NOVO", "USADO"], {
    message: "Selecione a condição",
  }),
  categoria_id: z
  .number()
  .nullable()
  .refine((val) => val !== null, { message: "Selecione uma categoria" }),
});

export type CriarAnuncioSchemaType = z.infer<typeof criarAnuncioSchema>;
