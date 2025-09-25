"use client";

import BottomNav from "@/components/Botoes/Bottom/button-nav";
import ConversationList from "@/components/Chat/ConversationList";
import Header from "@/components/Headers/header";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ListaConversas() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    function getCookie(name: string) {
      if (typeof document === "undefined") return undefined;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    }
    const id = getCookie("id");
    setUserId(id ? Number(id) : null);
  }, []);

  const handleSelectConversa = (id: number) => {
    router.push(`/chat?conversa=${id}`);
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col pt-6">
      <Header texto="Voltar" />
      <div className="px-6">
        {userId ? (
          <ConversationList userId={userId} onSelect={handleSelectConversa} />
        ) : (
          <p>Carregando...</p>
        )}
      </div>

      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
