"use client";
import { useEffect, useState } from "react";
import { api, getTokenFromCookies, setAuthHeader } from "@/lib/api";
import { Conversa } from "@/interface/IChat";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { UserCircle } from "lucide-react";

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
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Carregando conversas...</p>
      </div>
    );
  }

  if (conversas.length === 0) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          Você ainda não tem conversas.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <ul className="space-y-3">
        {conversas.map((conv) => {
          const dataFormatada = conv.data_criacao
            ? new Date(conv.data_criacao).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          // Determina se o usuário é o dono do anúncio desta conversa específica
          const isDonoConv = conv.anunciante_id === userId;
          // Define o nome do contato (quem vai conversar com o usuário)
          const nomeContato = isDonoConv ? conv.nome_interessado : conv.nome_anunciante;

          return (
            <Card key={conv.id} className="p-4 border-2 border-primary">
              <li onClick={() => onSelect(conv.id, nomeContato)}>
                <div className="flex flex-col">
                  <CardTitle className="flex items-center gap-2 mb-1">
                    <UserCircle className="text-primary" />
                    <span>{nomeContato}</span>
                    <span>-</span>
                    <span>{conv.anuncio_titulo}</span>
                  </CardTitle>
                  {/* <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {conv.ultima_mensagem || "Sem mensagens ainda."}
                    </p> */}
                  <CardDescription>
                    <p className="text-xs text-muted-foreground">
                      conversa iniciada em: {dataFormatada}
                    </p>
                  </CardDescription>
                </div>
              </li>
            </Card>
          );
        })}
      </ul>
    </div>
  );
}
