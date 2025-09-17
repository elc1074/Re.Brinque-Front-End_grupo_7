"use client";

import { useAnuncioUser } from "@/hooks/useAnuncioUser";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/Botoes/Bottom/button-nav";

function getCookie() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; id=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

export default function MeusAnunciosPage() {
  const id = getCookie();
  const { anuncio, isPending, isError, error } = useAnuncioUser(id);

  if (!id) return <div className="p-8 text-center">Carregando...</div>;
  if (isPending)
    return <div className="p-8 text-center">Carregando anúncio...</div>;
  if (isError)
    return <div className="p-8 text-center">Erro: {error?.message}</div>;
  if (!anuncio)
    return <div className="p-8 text-center">Anúncio não encontrado.</div>;

  return (
    <div className="min-h-dvh bg-background flex flex-col pt-6">
      {/* Header */}
      <header className="flex justify-between px-6">
        <div className="flex items-center space-x-4">
          <Link href="/tela-inicial">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-primary">
            Voltar
          </h1>
        </div>
      </header>

      <div className="p-4 max-w-sm mx-auto w-full pb-44">
        <p>teste</p>
      </div>

      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
