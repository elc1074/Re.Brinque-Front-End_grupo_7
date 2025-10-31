"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  texto: string;
}

export default function Header({ texto }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="relative flex items-center gap-3 px-6 py-2">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent pointer-events-none" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="relative z-10 hover:bg-primary/10 hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 text-primary group-hover:-translate-x-0.5 transition-transform duration-300" />
        <span className="sr-only">Voltar</span>
      </Button>

      <h1 className="relative z-10 text-xl font-bold text-foreground">
        {texto}
      </h1>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}
