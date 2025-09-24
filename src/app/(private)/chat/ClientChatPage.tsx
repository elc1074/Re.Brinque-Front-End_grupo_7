"use client";

import ChatRoom from "@/components/Chat/ChatRoom";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientChatPage() {
  const searchParams = useSearchParams();
  const conversaId = Number(searchParams.get("conversa"));

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/id=(\d+)/);
    if (match) {
      setUserId(Number(match[1]));
    }
  }, []);

  if (!conversaId || !userId) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Conversa inválida.
      </div>
    );
  }

  return <ChatRoom conversationId={conversaId} userId={userId} />;
}
