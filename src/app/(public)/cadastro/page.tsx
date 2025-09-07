"use client";

import CadastroForm from "@/components/Formularios/Login/cadastro-form";
import HeaderLogin from "@/components/Headers/header-login";

export default function CadastroPage() {
  return (
    <main className="min-h-dvh bg-background flex flex-col p-4">
      {/* Header */}
      <HeaderLogin title="Criar conta" />
        {/* Formulário */}
        <CadastroForm />
    </main>
  );
}
