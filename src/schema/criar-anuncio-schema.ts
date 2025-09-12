import { z } from "zod";

export const criarAnuncioSchema = z.object({
  categoria_id: z
    .number()
    .nullable()
    .refine((val) => val !== null, { message: "Selecione uma categoria" }),

  titulo: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Máximo 100 caracteres"),

  descricao: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(254, "Máximo 254 caracteres"),

  marca: z.string().nullable(),

  tipo: z.enum(["TROCA", "DOACAO"], {
    message: "Selecione o tipo do anúncio",
  }),

  condicao: z.enum(["NOVO", "SEMINOVO", "USADO"], {
    message: "Selecione a condição",
  }),

  status: z.enum(["DISPONIVEL", "NEGOCIANDO", "FINALIZADO"], {
    message: "Selecione o status",
  }),

  imagens: z.array(z.string().url()).min(1, "Envie pelo menos 1 foto"), // <- novo
});

export type CriarAnuncioSchemaType = z.infer<typeof criarAnuncioSchema>;
