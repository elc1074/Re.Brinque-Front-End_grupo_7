import { Button } from "@/components/ui/button";

interface LoginButtonProps {
  texto: string;
}

export default function LoginButton({ texto }: LoginButtonProps) {
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="max-w-sm mx-auto p-4">
        <Button type="submit" className="w-full h-12 text-base font-medium dark:text-white">
          {texto}
        </Button>
      </div>
    </div>
  );
}
