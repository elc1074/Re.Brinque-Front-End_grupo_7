import IAnuncio, { IAnuncioResponse } from "@/interface/IAnuncio";
import { useMutation, useQuery } from "@tanstack/react-query"

const URL_API = process.env.NEXT_PUBLIC_API_URL;

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

// Função para buscar anúncios
async function getAnunciosRequest(): Promise<IAnuncio[]> {
  const response = await fetch(`${URL_API}/api/anuncios`);
  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.text();
    throw new Error(error);
  }
}

export function useAnuncioMutation() {
  const mutation = useMutation<IAnuncioResponse, Error, IAnuncio>({
    mutationFn: criarAnuncioRequest,
  });

  // Hook para buscar anúncios
  const { data: anuncios, isLoading, isError, error } = useQuery<IAnuncio[], Error>({
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
    isLoadingAnuncios: isLoading,
    isErrorAnuncios: isError,
    errorAnuncios: error,
  };
}