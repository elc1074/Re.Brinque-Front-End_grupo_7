"use client";

import { Button } from "@/components/ui/button";
import { Home, SquarePlus, CircleUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="relative mx-auto max-w-lg">
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/90 to-background/80 backdrop-blur-xl rounded-t-3xl border-t border-border/50" />

        {/* Navigation content */}
        <div className="relative flex items-center justify-around px-6 py-4 gap-2">
          <Link href="/tela-inicial" className="flex-1 flex justify-center">
            <Button
              variant={isActive("/tela-inicial") ? "default" : "ghost"}
              className={`
                relative flex flex-col items-center justify-center gap-1.5 h-auto py-2.5 px-6 rounded-2xl
                transition-all duration-300 ease-out
                ${
                  isActive("/tela-inicial")
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }
              `}
            >
              <Home
                className={`size-5 transition-transform ${
                  isActive("/tela-inicial") ? "scale-110" : ""
                }`}
              />
              <span className="text-xs font-medium">Início</span>
              {isActive("/tela-inicial") && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground" />
              )}
            </Button>
          </Link>

          <Link href="/criar-anuncio" className="flex-1 flex justify-center">
            <Button
              variant={isActive("/criar-anuncio") ? "default" : "ghost"}
              className={`
                relative flex flex-col items-center justify-center gap-1.5 h-auto py-2.5 px-6 rounded-2xl
                transition-all duration-300 ease-out
                ${
                  isActive("/criar-anuncio")
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }
              `}
            >
              <div
                className={`
                ${
                  isActive("/criar-anuncio")
                    ? ""
                    : "p-1.5 rounded-xl bg-primary/10"
                }
                transition-all duration-300
              `}
              >
                <SquarePlus
                  className={`size-5 transition-transform ${
                    isActive("/criar-anuncio") ? "scale-110" : ""
                  }`}
                />
              </div>
              <span className="text-xs font-medium">Criar</span>
              {isActive("/criar-anuncio") && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground" />
              )}
            </Button>
          </Link>

          <Link href="/perfil" className="flex-1 flex justify-center">
            <Button
              variant={isActive("/perfil") ? "default" : "ghost"}
              className={`
                relative flex flex-col items-center justify-center gap-1.5 h-auto py-2.5 px-6 rounded-2xl
                transition-all duration-300 ease-out
                ${
                  isActive("/perfil")
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }
              `}
            >
              <CircleUser
                className={`size-5 transition-transform ${
                  isActive("/perfil") ? "scale-110" : ""
                }`}
              />
              <span className="text-xs font-medium">Perfil</span>
              {isActive("/perfil") && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground" />
              )}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
