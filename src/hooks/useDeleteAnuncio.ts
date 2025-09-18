"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const URL_API = process.env.NEXT_PUBLIC_API_URL;

export function useDeleteAnuncio() {
  const token =
    typeof document !== "undefined"
      ? document.cookie.match(/token=([^;]+)/)?.[1]
      : undefined;
  const qc = useQueryClient();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${URL_API}/api/anuncios/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Falha ao excluir anúncio");
      return res.json().catch(() => ({}));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["anunciosByUser"] });
    },
  });
}
