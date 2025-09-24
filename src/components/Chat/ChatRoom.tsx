"use client";
import { useEffect, useState, useRef } from "react";
import { api, getTokenFromCookies, setAuthHeader } from "@/lib/api";
import socket from "@/lib/socket";
import { Mensagem } from "@/interface/IChat";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChevronLeft, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  conversationId: number;
  userId: number;
}

export default function ChatRoom({ conversationId, userId }: Props) {
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
    <div className="min-h-dvh bg-background flex flex-col pt-6">
      <header className="flex justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="#" onClick={() => router.back()} aria-label="Voltar">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold">Chat com usuário</h1>{" "}
          {/* Adiconar um msg.remente_nome quando tiver no back */}
        </div>
      </header>
      <div className="flex-1 px-6">
        <div className="flex flex-col">
          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto space-y-4 pt-8">
            {mensagens.map((msg) => {
              const isUser = msg.remetente_id === userId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-lg shadow ${
                      isUser
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.conteudo}</p>
                    <p className="gap-2 flex justify-end">
                      <span className="text-xs text-white">
                        {isUser ? "Você" : "Sem nome de usuário"}{" "}
                        {/* Adiconar um msg.remente_nome quando tiver no back */}
                      </span>
                      <span className="text-xs text-white">
                        {formatarHora(msg.data_envio)}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {/* Campo fixo */}
          <div className="fixed bottom-0 left-0 w-full bg-background px-4 py-3 flex gap-2 items-center">
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
              className="flex-1 border rounded-2xl px-3 py-2"
              placeholder="Digite sua mensagem..."
            />
            <Button
              onClick={enviarMensagem}
              className="bg-primary text-white rounded-full h-10 items-center w-10"
            >
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
