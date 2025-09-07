"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { ModeToggle } from "../ui/mode-toggle";

interface HeaderLoginProps {
  title: string;
}

export default function HeaderLogin({ title }: HeaderLoginProps) {
  return (
    <div className="flex items-center p-4">
      <section className="absolute top-8 right-4">
        <ModeToggle className="text-primary" />
      </section>
      <Link href="/">
        <Button variant="ghost" size="icon" asChild>
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </Link>
      <h1 className="ml-4 text-2xl font-semibold">{title}</h1>
    </div>
  );
}
