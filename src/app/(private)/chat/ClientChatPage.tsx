'use client';

import ChatRoom from '@/components/Chat/ChatRoom';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientChatPage() {
  const searchParams = useSearchParams();
  const conversaId = Number(searchParams.get('conversa'));

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/id=(\d+)/);
    if (match) {
      setUserId(Number(match[1]));
    }
  }, []);

  if (!conversaId || !userId) {
    return <div className="p-6 text-center text-muted-foreground">Conversa inválida.</div>;
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col pt-6">
      <header className="px-6 pb-4">
        <h1 className="text-xl font-semibold text-foreground">Chat</h1>
      </header>
      <div className="flex-1 px-6">
        <ChatRoom conversationId={conversaId} userId={userId} />
      </div>
    </div>
  );
}
