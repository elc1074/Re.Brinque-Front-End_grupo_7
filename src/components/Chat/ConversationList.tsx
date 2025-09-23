'use client';
import { useEffect, useState } from 'react';
import { api, getTokenFromCookies, setAuthHeader } from '@/lib/api';
import { Conversa } from '@/interface/IChat';

interface Props {
  userId: number;
  onSelect: (conversationId: number) => void;
}

export default function ConversationList({ userId, onSelect }: Props) {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getTokenFromCookies();
    setAuthHeader(token);

    const fetchConversas = async () => {
      try {
        const res = await api.get(`/api/chat/usuario/${userId}/conversas`);
        setConversas(res.data);
      } catch (err) {
        console.error('Erro ao buscar conversas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversas();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Carregando conversas...</p>
      </div>
    );
  }

  if (conversas.length === 0) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Você ainda não tem conversas.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">Suas conversas</h2>
      <ul className="space-y-3">
        {conversas.map((conv) => {
          const dataFormatada = conv.data_ultima_mensagem
            ? new Date(conv.data_ultima_mensagem).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';

          return (
            <li
              key={conv.id}
              className="cursor-pointer px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex justify-between items-center"
              onClick={() => onSelect(conv.id)}
            >
              <div className="flex flex-col">
                <p className="text-zinc-900 dark:text-white font-medium">{conv.anuncio_titulo}</p>
                <p className="text-sm text-muted-foreground truncate max-w-xs">
                  {conv.ultima_mensagem || 'Sem mensagens ainda'}
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-xs text-muted-foreground">{dataFormatada}</p>
                {conv.unread_count && conv.unread_count > 0 && (
                  <span className="mt-1 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                    {conv.unread_count}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
