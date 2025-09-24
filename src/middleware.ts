import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set<string>(["/", "/login", "/cadastro", "/google-callback"]);

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;

  // Arquivos estáticos e internos do Next
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/public/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json" ||
    /\.[a-zA-Z0-9]+$/.test(pathname) // qualquer arquivo com extensão
  ) {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Permite preflight e HEAD sem checagem
  if (request.method === "OPTIONS" || request.method === "HEAD") {
    return NextResponse.next();
  }

  // Verifica token no cookie
  const token = request.cookies.get("token")?.value;

  // Se rota pública e usuário autenticado, redireciona para tela-inicial
  if (isPublic(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/tela-inicial", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    // Mantém o comportamento original (redir para "/")
    // e ainda preserva a rota pretendida (param opcional)
    const url = new URL("/", request.url);
    url.searchParams.set("redirect", `${pathname}${search || ""}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Evita rodar em /api e internals do Next (mais performance e menos interferência)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json).*)",
  ],
};
