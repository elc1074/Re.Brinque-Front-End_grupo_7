"use client";

import LoginForm from "@/components/Formularios/Login/login-from";
import HeaderLogin from "@/components/Headers/header-login";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-background flex flex-col p-4">
      {/* Header */}
      <HeaderLogin title="Acessar conta" />

      {/* Formulário de Login */}
      <LoginForm />
    </div>
  );
}
