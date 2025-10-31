"use client";

import ChatRoom from "@/components/Chat/ChatRoom";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientChatPage() {
  const searchParams = useSearchParams();
  const conversaId = Number(searchParams.get("conversa"));
  const nomeContato = searchParams.get("nome") || "Usuário";

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/id=(\d+)/);
    if (match) {
      setUserId(Number(match[1]));
    }
  }, []);

  if (!conversaId || !userId) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-muted-foreground font-medium">Conversa inválida</p>
          <p className="text-sm text-muted-foreground/70">
            Não foi possível carregar esta conversa
          </p>
        </div>
      </div>
    );
  }

  return (
    <ChatRoom
      conversationId={conversaId}
      userId={userId}
      nomeContato={nomeContato}
    />
  );
}
