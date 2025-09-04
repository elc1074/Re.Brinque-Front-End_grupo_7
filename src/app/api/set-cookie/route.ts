// app/api/set-cookie/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, id, nome, email } = await req.json();

  const response = NextResponse.json({
    message: "Cookie definido com sucesso",
  });

  // Definir cookie de forma segura
  response.cookies.set("token", token, {
    httpOnly: true, // inacessível ao JS, protegido contra ataques XSS
    secure: true, // apenas HTTPS
    sameSite: "strict", // evita ataques CSRF
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
  });


  response.cookies.set("id", id, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set("nome", nome, {
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set("email", email, {
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
