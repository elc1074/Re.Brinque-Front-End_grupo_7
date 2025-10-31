"use client";

import LoginForm from "@/components/Formularios/Login/login-from";
import HeaderLogin from "@/components/Headers/header-login";

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <HeaderLogin title="Acessar conta" />

      {/* Formulário de Login */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <LoginForm />
      </div>
    </main>
  );
}
