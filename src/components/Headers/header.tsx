import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  texto: string;
}

export default function Header({ texto }: HeaderProps) {
    const router = useRouter();
    return (
        <header className="flex justify-between px-4 text-primary">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.back()}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">
              {texto}
            </h1>
          </div>
        </header>
    );
}