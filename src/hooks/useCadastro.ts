import ICadastro, { ICadastroResponse } from "@/interface/ICadastro";
import { useMutation } from "@tanstack/react-query";

const URL_API = process.env.NEXT_PUBLIC_API_URL;

async function Cadastro(data: ICadastro): Promise<ICadastroResponse> {
  try {
    const response = await fetch(`${URL_API}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

export function useCadastro() {
  const mutation = useMutation<ICadastroResponse, Error, ICadastro>({
    mutationFn: Cadastro,
  });

  return {
    cadastrar: mutation.mutateAsync,
    isPending: mutation.status === "pending",
    isSuccess: mutation.status === "success",
    isError: mutation.status === "error",
    error: mutation.error,
    data: mutation.data,
  };
}
