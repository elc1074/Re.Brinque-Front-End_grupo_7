import { Button } from "@/components/ui/button";
import { Home, Search, SquarePlus, CircleUser } from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
  return (
    <div className="flex w-full bg-[#EBEEEC] dark:bg-zinc-800 rounded-t-2xl p-6 gap-2 justify-center">
      <Link href="/tela-inicial">
        <Button className="flex items-center rounded-lg bg-primary h-12 w-28 text-lg">
          <Home className="!size-6"/>
          Início
        </Button>
      </Link>
      <Link href="/buscar">
        <Button className="flex items-center rounded-lg bg-primary h-12 w-12">
          <Search className="!size-6"/>
        </Button>
      </Link>
      <Link href="/criar-anuncio">
        <Button className="flex items-center rounded-lg bg-primary h-12 w-12">
          <SquarePlus className="!size-6"/>
        </Button>
      </Link>
      <Link href="/perfil">
        <Button className="flex items-center rounded-lg bg-primary h-12 w-12">
          <CircleUser className="!size-6"/>
        </Button>
      </Link>
    </div>
  );
}
