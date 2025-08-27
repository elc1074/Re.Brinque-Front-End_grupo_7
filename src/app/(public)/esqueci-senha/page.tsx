"use client";

import HeaderLogin from "@/components/Headers/header-login";
import EsqueciSenhaForm from "@/components/Formularios/Login/esqueci-form";

export default function ForgotPasswordPage() {

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <HeaderLogin title="Alterar minha senha" />

      {/* Form */}
      <EsqueciSenhaForm />
    </div>
  );
}
