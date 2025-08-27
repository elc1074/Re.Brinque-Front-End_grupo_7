"use client";

import Link from "next/link";
import LoginForm from "@/components/Formularios/Login/login-from";
import HeaderLogin from "@/components/Headers/header-login";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <HeaderLogin title="Acessar conta" />

      {/* Formulário de Login */}
      <LoginForm />
    </div>
  );
}
