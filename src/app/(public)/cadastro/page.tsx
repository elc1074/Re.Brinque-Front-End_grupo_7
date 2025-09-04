"use client";

import CadastroForm from "@/components/Formularios/Login/cadastro-form";
import HeaderLogin from "@/components/Headers/header-login";

export default function CadastroPage() {
  return (
    <div className="min-h-dvh bg-background flex flex-col p-4">
      <HeaderLogin title="Criar conta" />
      <div className="mt-10">
        {/* Formulário */}
        <CadastroForm />
      </div>
    </div>
  );
}
