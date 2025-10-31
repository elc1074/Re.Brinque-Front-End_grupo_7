"use client";
import { useEffect, useState } from "react";
import { api, getTokenFromCookies, setAuthHeader } from "@/lib/api";
import type { Conversa } from "@/interface/IChat";
import { Card } from "../ui/card";
import { UserCircle, MessageCircle } from "lucide-react";

interface Props {
  userId: number;
  onSelect: (conversationId: number, nomeContato: string) => void;
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
        console.error("Erro ao buscar conversas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversas();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="relative inline-block">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary/30 border-t-primary"></div>
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary/20"></div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 animate-pulse">
          Carregando conversas...
        </p>
      </div>
    );
  }

  if (conversas.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
          <MessageCircle className="w-12 h-12 text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground mb-2">
          Nenhuma conversa ainda
        </p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Suas conversas com outros usuários aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 px-4 pb-32">
      <ul className="space-y-3">
        {conversas.map((conv, idx) => {
          const dataFormatada = conv.data_criacao
            ? new Date(conv.data_criacao).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          const isDonoConv = conv.anunciante_id === userId;
          const nomeContato = isDonoConv
            ? conv.nome_interessado
            : conv.nome_anunciante;

          return (
            <li
              key={conv.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <Card
                className="p-4 bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-[0.98] group"
                onClick={() => onSelect(conv.id, nomeContato)}
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                    <UserCircle className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                        {nomeContato}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2 leading-relaxed">
                      {conv.anuncio_titulo}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {dataFormatada}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
