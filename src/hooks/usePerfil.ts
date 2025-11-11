import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

// Interface para a resposta da atualização da foto
interface UpdateFotoResponse {
  message: string;
  usuario: {
    id: number;
    nome_completo: string;
    email: string;
    telefone: string;
    google_id?: string;
    foto_perfil_url?: string;
  };
}

// Interface para o corpo da requisição de atualização
interface UpdateFotoPayload {
  userId: string | number;
  foto_perfil_url: string;
}

// Função para atualizar a foto de perfil
async function updateFotoPerfil(
  payload: UpdateFotoPayload
): Promise<UpdateFotoResponse> {
  const { userId, foto_perfil_url } = payload;
  const token = getCookie("token");
  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  const response = await api.put<UpdateFotoResponse>(
    `api/usuarios/perfil/foto`,
    { foto_perfil_url },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

/**
 * Hook para atualizar a foto de perfil do usuário.
 * Usa o `useMutation` do react-query.
 */
export function useUpdateFotoPerfil() {
  const queryClient = useQueryClient();

  return useMutation<UpdateFotoResponse, Error, UpdateFotoPayload>({
    mutationFn: updateFotoPerfil,
    onSuccess: (data, variables) => {
      // Invalida a query da foto do perfil para forçar a atualização
      queryClient.invalidateQueries({
        queryKey: ["fotoPerfil", variables.userId],
      });
      // Opcional: invalidar outras queries que usam dados do usuário
      queryClient.invalidateQueries({ queryKey: ["usuario", variables.userId] });
    },
  });
}

// Interface para a resposta da busca da foto
interface FotoPerfilResponse {
  foto_perfil_url: string | null;
}

// Função para buscar a foto de perfil por ID
async function fetchFotoPerfil(
  userId: number | string
): Promise<FotoPerfilResponse> {
  const response = await api.get<FotoPerfilResponse>(`/api/usuarios/${userId}/foto`);
  return response.data;
}

/**
 * Hook para buscar a foto de perfil de um usuário por ID.
 * Usa o `useQuery` do react-query.
 * @param userId - O ID do usuário.
 */
export function useFotoPerfil(userId: number | string | null | undefined) {
  return useQuery<FotoPerfilResponse, Error>({
    queryKey: ["fotoPerfil", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("ID do usuário não fornecido.");
      }
      return fetchFotoPerfil(userId);
    },
    enabled: !!userId, // A query só será executada se o userId for fornecido
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });
}
