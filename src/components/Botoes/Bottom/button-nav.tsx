import { Button } from "@/components/ui/button";
import { Home, Search, SquarePlus, CircleUser } from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
  return (
    <div className="flex w-full bg-[#EBEEEC] dark:bg-zinc-800 rounded-t-2xl p-6 gap-4 justify-center">

      <Link href="/tela-inicial">
        <Button className="text-white  flex items-center rounded-lg bg-primary h-12 w-18 text-lg">
          <Home className="!size-6"/>
        </Button>
      </Link>

      <Link href="/criar-anuncio">
        <Button className="text-white flex items-center rounded-lg bg-primary h-12 w-18">
          <SquarePlus className="!size-6"/>
        </Button>
      </Link>

      <Link href="/perfil">
        <Button className="text-white flex items-center rounded-lg bg-primary h-12 w-18">
          <CircleUser className="!size-6"/>
        </Button>
      </Link>
    </div>
  );
}
