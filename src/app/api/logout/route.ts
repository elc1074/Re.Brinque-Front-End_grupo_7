import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Cria uma resposta de redirecionamento
    const response = NextResponse.redirect(new URL("/login", request.url));

    // Remove todos os cookies
    response.cookies.delete("nome");
    response.cookies.delete("email");
    response.cookies.delete("token");
    response.cookies.delete("id");

    return response;
  } catch (error) {
    console.error("Erro durante logout:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
