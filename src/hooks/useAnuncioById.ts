// hooks/useAnuncioById.ts
"use client";
import IAnuncio from "@/interface/IAnuncio";
import { useQuery } from "@tanstack/react-query";

const URL_API = process.env.NEXT_PUBLIC_API_URL;

async function getAnuncioByIdRequest(id: string): Promise<IAnuncio> {
  const response = await fetch(`${URL_API}/api/anuncios/${id}`);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const json = await response.json();
  const item =
    json && typeof json === "object" && "anuncio" in json ? json.anuncio : json;
  return item as IAnuncio;
}

export function useAnuncioById(id?: string) {
  const { data, isPending, isError, error } = useQuery<IAnuncio, Error>({
    queryKey: ["anuncio", id],
    queryFn: () => getAnuncioByIdRequest(String(id)),
    enabled: !!id,
  });

  return { anuncio: data, isPending, isError, error };
}
