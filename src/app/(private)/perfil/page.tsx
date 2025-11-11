"use client";

import type React from "react";

import BottomNav from "@/components/Botoes/Bottom/button-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Camera,
  ChevronRight,
  Loader2,
  LogOut,
  Moon,
  Pencil,
  PencilLine,
  ShoppingBag,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFotoPerfil, useUpdateFotoPerfil } from "@/hooks/usePerfil";
import { toast } from "sonner";
import { useCloudinaryConfig } from "@/hooks/useCloudinaryConfig";
import { Input } from "@/components/ui/input";

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
  const { data, isLoading } = useFotoPerfil(id);
  const { mutate: updateFoto, isPending: isUpdatingFoto } =
    useUpdateFotoPerfil();
  const { config, loading: isConfigLoading } = useCloudinaryConfig();

  const handleUploadSuccess = (result: any) => {
    const imageUrl = result.info.secure_url;
    if (id) {
      updateFoto(
        { userId: id, foto_perfil_url: imageUrl },
        {
          onSuccess: () => {
            toast.success("Foto de perfil atualizada com sucesso!");
          },
          onError: (error) => {
            toast.error(`Erro ao atualizar a foto: ${error.message}`);
          },
        }
      );
    }
  };

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
          <div className="relative">
            <Avatar className="size-24">
              <AvatarImage
                src={data?.foto_perfil_url ?? undefined}
                alt={userName}
                className="object-cover"
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <label
              className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-2 shadow-md hover:bg-primary/80 transition-colors flex items-center cursor-pointer"
              aria-label={
                data?.foto_perfil_url
                  ? "Editar foto de perfil"
                  : "Enviar foto de perfil"
              }
            >
              {isUpdatingFoto ? (
                <Loader2 className="animate-spin size-5" />
              ) : data?.foto_perfil_url ? (
                <Pencil className="size-5" />
              ) : (
                <Camera className="size-5" />
              )}
              <Input
                type="file"
                // Removido o capture para não sugerir câmera
                accept=".jpg,.jpeg,.png,.webp" // ajuste se quiser outros tipos
                multiple={false}
                aria-label="Enviar arquivo de imagem"
                className="hidden"
                disabled={isConfigLoading || isUpdatingFoto}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !config) return;

                  // Validação rápida
                  if (
                    !["image/jpeg", "image/png", "image/webp"].includes(
                      file.type
                    )
                  ) {
                    toast.error("Formato inválido. Envie JPG, PNG ou WEBP.");
                    e.target.value = "";
                    return;
                  }
                  if (file.size > 10 * 1024 * 1024) {
                    toast.error("Arquivo acima de 10MB, envie um menor.");
                    e.target.value = "";
                    return;
                  }

                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("upload_preset", config.uploadPreset);
                  formData.append("api_key", config.apiKey);

                  try {
                    toast("Enviando arquivo...");
                    const res = await fetch(
                      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
                      { method: "POST", body: formData }
                    );
                    if (!res.ok) {
                      toast.error("Falha no upload: " + (await res.text()));
                      return;
                    }
                    const dataImg = await res.json();
                    if (dataImg.secure_url) {
                      handleUploadSuccess({
                        info: { secure_url: dataImg.secure_url },
                      });
                    }
                  } catch {
                    toast.error("Erro ao enviar arquivo.");
                  } finally {
                    e.target.value = "";
                  }
                }}
              />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              {userName}
            </p>
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
