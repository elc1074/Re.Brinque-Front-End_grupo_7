"use client";

import BottomNav from "@/components/Botoes/Bottom/button-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Accessibility,
  Bell,
  Camera,
  ChevronRight,
  FileText,
  CircleHelp,
  Fingerprint,
  Globe,
  Heart,
  Lock,
  LogOut,
  Moon,
  PencilLine,
  ShoppingBag,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [biometria, setBiometria] = useState(true);

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
    <main className="min-h-dvh bg-[#EBEEEC] dark:bg-zinc-800 flex flex-col">
      {/* Top header + avatar */}
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-primary pt-4 pl-4 pb-2">
        Conta
      </h1>

      <section className="bg-background rounded-t-2xl ">
        <div className="mt-6 flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-20 w-20 text-lg">
              <AvatarFallback className="bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 size-7 rounded-full bg-zinc-200 dark:bg-zinc-700 grid place-content-center border border-white dark:border-zinc-900">
              <Camera className="size-4 text-zinc-700 dark:text-zinc-100" />
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <p className="text-base font-medium text-zinc-800 dark:text-zinc-100">
              {userName}
            </p>
            <PencilLine className="size-4 text-zinc-700 dark:text-zinc-300" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className=" bg-background px-6 py-4 space-y-6 pb-36">
        <div>
          <h2 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
            Meus dados
          </h2>
          <div className="bg-card rounded-2xl p-2">
            <Link href={`/meus-anuncios/${id}`}>
              <Row
                icon={<ShoppingBag className="size-5" />}
                label="Meus anúncios"
              />
            </Link>
            <Row icon={<Heart className="size-5" />} label="Favoritos" />
            <Row icon={<Bell className="size-5" />} label="Notificações" />
          </div>
        </div>

        <div>
          <h2 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
            Preferências
          </h2>
          <div className="bg-card rounded-2xl p-2">
            <Row
              icon={<Accessibility className="size-5" />}
              label="Acessibilidade"
            />
            <Row
              icon={<Globe className="size-5" />}
              label="Idioma"
              right={
                <span className="text-sm text-zinc-500 dark:text-zinc-300 mr-1">
                  Português
                </span>
              }
            />
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

        <div>
          <h2 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
            Privacidade e segurança
          </h2>
          <div className="bg-card rounded-2xl p-2">
            <Row icon={<Lock className="size-5" />} label="Alterar senha" />
            <Row
              icon={<Fingerprint className="size-5" />}
              label="Biometria"
              right={<Switch checked={biometria} onChange={setBiometria} />}
            />
            <Row
              icon={<Bell className="size-5" />}
              label="Configurar notificações"
            />
          </div>
        </div>

        <div>
          <h2 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
            Ajuda
          </h2>
          <div className="bg-card rounded-2xl p-2">
            <Row
              icon={<CircleHelp className="size-5" />}
              label="Central de ajuda"
            />
            <Row icon={<FileText className="size-5" />} label="Termos de uso" />
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-primary text-primary hover:bg-primary/5"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 size-5" /> Sair
          </Button>
        </div>
      </section>

      <div className="w-full fixed bottom-0 flex justify-center">
        <BottomNav />
      </div>
    </main>
  );
}
