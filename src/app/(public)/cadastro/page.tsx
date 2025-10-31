"use client"

import CadastroForm from "@/components/Formularios/Login/cadastro-form"
import HeaderLogin from "@/components/Headers/header-login"

export default function CadastroPage() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <HeaderLogin title="Criar conta" />

      {/* Formulário */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <CadastroForm />
      </div>
    </main>
  )
}
