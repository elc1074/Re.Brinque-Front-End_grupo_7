import CriarAnuncioForm from "@/components/Anuncios/Form/criar-anuncio";
import { cookies } from "next/headers";


export default async function CriarAnuncio() {
  const cookieStore = await cookies();
  const usuario_id = Number(cookieStore.get("id")?.value);

  return (
    <main className="min-h-dvh bg-background flex flex-col pt-6">
      <CriarAnuncioForm usuario_id={usuario_id} />
    </main>
  );
}
