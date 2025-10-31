"use client";

import BottomNav from "@/components/Botoes/Bottom/button-nav";
import ConversationList from "@/components/Chat/ConversationList";
import Header from "@/components/Headers/header";
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

  const handleSelectConversa = (id: number, nomeContato: string) => {
    router.push(`/chat?conversa=${id}&nome=${encodeURIComponent(nomeContato)}`);
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-primary/5 flex flex-col">
      {/* Header com gradiente sutil */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50 pt-6 pb-4">
        <Header texto="Conversas" />
      </div>

      {/* Lista de conversas */}
      <div className="flex-1 px-4 py-6">
        {userId ? (
          <ConversationList userId={userId} onSelect={handleSelectConversa} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground animate-pulse">
                Carregando conversas...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full flex justify-center">
        <BottomNav />
      </div>
    </div>
  );
}
