"use client";

import { useQuery } from "@tanstack/react-query";
const URL_API = process.env.NEXT_PUBLIC_API_URL;

export type AnuncioImagem = { url_imagem: string; principal?: boolean };
export type Anuncio = {
  id: string;
  titulo: string;
  descricao?: string;
  preco?: number | null;
  tipo?: "VENDA" | "DOACAO";
  condicao?: "NOVO" | "SEMINOVO" | "USADO";
  imagens?: AnuncioImagem[];
  status?: "PUBLICADO" | "FINALIZADO" | "VENDIDO";
  vendido?: boolean;
  finalizado?: boolean;
  created_at?: string;
  data_publicacao?: string;
};

export function useAnuncioUser(userId?: string) {
  return useQuery<Anuncio[]>({
    queryKey: ["anunciosByUser", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(`${URL_API}/api/anuncios/usuario/${userId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Erro ao buscar anúncios do usuário");
      const data = await res.json();
      // Normaliza: aceita { anuncios: [...] } ou array direto
      return Array.isArray(data) ? data : data?.anuncios ?? [];
    },
  });
}
