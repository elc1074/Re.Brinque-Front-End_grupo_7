"use client";

import type React from "react";

import BottomNav from "@/components/Botoes/Bottom/button-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Camera,
  ChevronRight,
  LogOut,
  Moon,
  PencilLine,
  ShoppingBag,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Row({
  icon,
  label,
  right,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between py-3 px-1 rounded-lg hover:bg-accent/60 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-[#EBEEEC] dark:bg-zinc-800 grid place-content-center text-zinc-700 dark:text-zinc-200">
          {icon}
        </div>
        <span className="text-[15px] text-zinc-800 dark:text-zinc-100 text-left">
          {label}
        </span>
      </div>
      <div className="text-zinc-500 dark:text-zinc-300 flex items-center gap-2">
        {right ?? <ChevronRight className="size-5" />}
      </div>
    </button>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <span
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onChange(!checked);
      }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-700"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </span>
  );
}

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

const name = getCookie("nome");
const id = getCookie("id");
const userName = name ? decodeURIComponent(name) : "";
const userInitials = userName ? userName.slice(0, 2).toUpperCase() : "";

export default function PerfilPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const darkEnabled = theme === "dark";

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Erro na API de logout:", error);
    } finally {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#EBEEEC] to-background dark:from-zinc-900 dark:to-zinc-800 flex flex-col">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 pt-6 pb-4 px-4">
        <h1 className="text-2xl font-bold text-primary">Minha Conta</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas informações e preferências
        </p>
      </div>

      <section className="bg-background rounded-t-3xl shadow-lg -mt-2">
        <div className="mt-8 flex flex-col items-center">
          <div className="relative group">
            <Avatar className="h-24 w-24 text-xl border-4 border-background shadow-xl">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-2xl font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 size-8 rounded-full bg-primary grid place-content-center border-2 border-background shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
              <Camera className="size-4 text-white" />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              {userName}
            </p>
            <button className="p-1 hover:bg-muted rounded-full transition-colors">
              <PencilLine className="size-4 text-zinc-700 dark:text-zinc-300" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-6 space-y-6 pb-36">
        <div>
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-3 uppercase tracking-wide">
            Meus dados
          </h2>
          <div className="bg-card rounded-2xl p-2 shadow-md border border-border/50">
            <Link href={`/meus-anuncios/${id}`}>
              <Row
                icon={<ShoppingBag className="size-5" />}
                label="Meus anúncios"
              />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-3 uppercase tracking-wide">
            Preferências
          </h2>
          <div className="bg-card rounded-2xl p-2 shadow-md border border-border/50">
            <Row
              icon={<Moon className="size-5" />}
              label="Modo escuro"
              right={
                <Switch
                  checked={darkEnabled}
                  onChange={(v) => setTheme(v ? "dark" : "light")}
                />
              }
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive font-semibold shadow-sm transition-all duration-300 bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 size-5" /> Sair da conta
          </Button>
        </div>
      </section>

      <div className="w-full fixed bottom-0 flex justify-center">
        <BottomNav />
      </div>
    </main>
  );
}
