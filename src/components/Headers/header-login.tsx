"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../ui/mode-toggle";

interface HeaderLoginProps {
  title: string;
}

export default function HeaderLogin({ title }: HeaderLoginProps) {
  return (
    <div className="relative">
      {/* Gradiente decorativo no topo */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 transition-colors duration-300"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {title}
          </h1>
        </div>

        <ModeToggle />
      </div>
    </div>
  );
}
