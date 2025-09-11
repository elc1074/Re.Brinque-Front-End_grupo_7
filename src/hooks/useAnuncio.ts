
"use client";
import IAnuncio, { IAnuncioResponse } from "@/interface/IAnuncio";
import { useMutation, useQuery } from "@tanstack/react-query";

const URL_API = process.env.NEXT_PUBLIC_API_URL;

// Função para criar anúncio
async function criarAnuncioRequest(data: IAnuncio): Promise<IAnuncioResponse> {
  try {
    const token =
      typeof document !== "undefined"
        ? document.cookie.match(/token=([^;]+)/)?.[1]
        : undefined;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${URL_API}/api/anuncios`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const result = await response.json();
      return { message: result.message };
    } else {
      const error = await response.text();
      return { error };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}

// Função para buscar todos anúncios
async function getAnunciosRequest(): Promise<IAnuncio[]> {
  const response = await fetch(`${URL_API}/api/anuncios`);
  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.text();
    throw new Error(error);
  }
}

// Função para buscar anúncio por id
async function getAnuncioByIdRequest(id: string): Promise<IAnuncio> {
  const response = await fetch(`${URL_API}/api/anuncios/${id}`);
  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.text();
    throw new Error(error);
  }
}

// Hook para criar e listar anúncios
export function useAnuncioMutation() {
  const mutation = useMutation<IAnuncioResponse, Error, IAnuncio>({
    mutationFn: criarAnuncioRequest,
  });

  // Hook para buscar anúncios
  const { data: anuncios, isPending, isError, error } = useQuery<IAnuncio[], Error>({
    queryKey: ["anuncios"],
    queryFn: getAnunciosRequest,
  });

  return {
    criarAnuncio: mutation.mutateAsync,
    isPending: mutation.status === "pending",
    isSuccess: mutation.status === "success",
    isError: mutation.status === "error",
    error: mutation.error,
    data: mutation.data,
    anuncios,
    isPendingAnuncios: isPending,
    isErrorAnuncios: isError,
    errorAnuncios: error,
  };
}

// Hook para buscar anúncio por id
export function useAnuncioById(id: string) {
  const { data, isPending, isError, error } = useQuery<IAnuncio, Error>({
    queryKey: ["anuncio", id],
    queryFn: () => getAnuncioByIdRequest(id),
    enabled: !!id,
  });

  return {
    anuncio: data,
    isPending,
    isError,
    error,
  };
}