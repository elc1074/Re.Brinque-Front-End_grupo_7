import { cookies } from "next/headers";

export default async function TelaInicial() {
  const cookieStore = await cookies();
  const nome = cookieStore.get("nome")?.value;
  return (
    <div className="min-h-dvh bg-zinc-100 dark:bg-zinc-900">
      <h1 className="p-4 text-2xl">Olá, {nome}</h1>
    </div>
  );
}
