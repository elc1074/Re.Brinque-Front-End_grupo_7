"use client";

import CadastroForm from "@/components/Formularios/Login/cadastro-form";
import HeaderLogin from "@/components/Headers/header-login";

export default function CadastroPage() {
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderLogin title="Criar conta" />

      {/* Formulário */}
      <CadastroForm />
    </div>
  );
}
