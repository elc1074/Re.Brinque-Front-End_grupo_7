'use client';
import { useEffect, useState, useRef } from 'react';
import { api, getTokenFromCookies, setAuthHeader } from '@/lib/api';
import socket from '@/lib/socket';
import { Mensagem } from '@/interface/IChat';

interface Props {
  conversationId: number;
  userId: number;
}

export default function ChatRoom({ conversationId, userId }: Props) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getTokenFromCookies();
    setAuthHeader(token);

    api.get(`/api/chat/conversas/${conversationId}/mensagens`)
      .then(res => setMensagens(res.data))
      .catch(err => console.error('Erro ao carregar mensagens:', err));

    socket.emit('joinRoom', { conversationId, userId });

    socket.on('novaMensagem', (msg: Mensagem) => {
      setMensagens(prev => [...prev, msg]);
    });

    return () => {
      socket.off('novaMensagem');
    };
  }, [conversationId, userId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviarMensagem = () => {
    if (input.trim()) {
      socket.emit('enviarMensagem', {
        conversationId,
        senderId: userId,
        content: input,
      });
      setInput('');
    }
  };

  const formatarHora = (data: string) => {
    const d = new Date(data);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative h-dvh flex flex-col bg-background">
      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
        {mensagens.map((msg) => {
          const isUser = msg.remetente_id === userId;
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg shadow ${
                  isUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.conteudo}</p>
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {formatarHora(msg.data_envio)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Campo fixo */}
      <div className="fixed bottom-0 left-0 w-full bg-background border-t px-4 py-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              enviarMensagem();
            }
          }}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Digite sua mensagem..."
        />
        <button
          onClick={enviarMensagem}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
