"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function PWAPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Não mostrar se já instalou
    if (typeof window === "undefined") return;
    // iOS: window.navigator.standalone pode não existir
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || ("standalone" in window.navigator && (window.navigator as any).standalone);
    if (isStandalone) {
      return;
    }
    // Verifica se já foi aceito/recusado
    if (localStorage.getItem("pwa-installed") === "true") return;

    function beforeInstallPrompt(e: any) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    }
    window.addEventListener("beforeinstallprompt", beforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", beforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        localStorage.setItem("pwa-installed", "true");
        setShow(false);
      } else {
        // Se recusou, não mostrar novamente nesta sessão
        setShow(false);
      }
    }
  };

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("pwa-installed", "true");
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent>
        <DialogHeader className="flex items-center justify-center gap-2">
            <Image 
            src="/icons/icon-192x192.png"
            alt="App Icon"
            width={48}
            height={48}
            />
          <DialogTitle>Instale nosso app!</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-center">
          Para uma experiência melhor, instale o app na sua tela inicial.
        </div>
        <DialogFooter>
          <Button onClick={handleInstall} autoFocus>
            Instalar
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            Agora não
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
