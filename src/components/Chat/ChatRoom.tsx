"use client";
import { useEffect, useState, useRef } from "react";
import { api, getTokenFromCookies, setAuthHeader } from "@/lib/api";
import socket from "@/lib/socket";
import type { Mensagem } from "@/interface/IChat";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChevronLeft, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  conversationId: number;
  userId: number;
  nomeContato: string;
}

export default function ChatRoom({
  conversationId,
  userId,
  nomeContato,
}: Props) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getTokenFromCookies();
    setAuthHeader(token);

    api
      .get(`/api/chat/conversas/${conversationId}/mensagens`)
      .then((res) => setMensagens(res.data))
      .catch((err) => console.error("Erro ao carregar mensagens:", err));

    socket.emit("joinRoom", { conversationId, userId });

    socket.on("novaMensagem", (msg: Mensagem) => {
      setMensagens((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("novaMensagem");
    };
  }, [conversationId, userId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  const enviarMensagem = () => {
    if (input.trim()) {
      socket.emit("enviarMensagem", {
        conversationId,
        senderId: userId,
        content: input,
      });
      setInput("");
    }
  };

  const formatarHora = (data: string) => {
    const d = new Date(data);
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-muted/20 flex flex-col">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm p-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full hover:bg-primary/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </Button>
        </div>
          <div className="flex justify-center items-center">
            <h1 className="text-lg font-semibold text-foreground">
              {nomeContato}
            </h1>
            <p className="text-xs text-muted-foreground"></p>
          </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-24">
        {mensagens.map((msg) => {
          const isUser = msg.remetente_id === userId;
          return (
            <div
              key={msg.id}
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md transition-all hover:shadow-lg ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card text-card-foreground border border-border/50 rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
                  {msg.conteudo}
                </p>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <span
                    className={`text-xs ${
                      isUser
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatarHora(msg.data_envio)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 shadow-lg">
        <div className="px-4 py-3 flex gap-3 items-center max-w-2xl mx-auto">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviarMensagem();
              }
            }}
            className="flex-1 h-12 rounded-full px-5 bg-muted/50 border-border/50 focus:border-primary/50 transition-all shadow-sm"
            placeholder="Digite sua mensagem..."
          />
          <Button
            onClick={enviarMensagem}
            disabled={!input.trim()}
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            <SendHorizonal className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
