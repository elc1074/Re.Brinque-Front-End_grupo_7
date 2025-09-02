import ICadastro, { ICadastroResponse } from "@/interface/ICadastro";

const URL_API = process.env.NEXT_PUBLIC_API_URL;

export async function useCadastro(
  nome_completo: ICadastro["nome_completo"],
  email: ICadastro["email"],
  telefone: ICadastro["telefone"],
  senha: ICadastro["senha"]
): Promise<ICadastroResponse> {
  try {
    const response = await fetch(`${URL_API}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome_completo, email, telefone, senha }),
    });
    if (response.ok) {
      const data = await response.json();
      return { message: data.message };
    } else {
      const error = await response.text();
      return { error };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}
