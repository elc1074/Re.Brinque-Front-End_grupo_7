"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import React from "react";

interface FiltroSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoriaId: string;
  setCategoriaId: (v: string) => void;
  tipo: string;
  setTipo: (v: string) => void;
  condicao: string;
  setCondicao: (v: string) => void;
  onAplicar: () => void;
}

export default function FiltroSheet({
  open,
  onOpenChange,
  categoriaId,
  setCategoriaId,
  tipo,
  setTipo,
  condicao,
  setCondicao,
  onAplicar,
}: FiltroSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="link" size="icon" className="ml-2">
          <SlidersHorizontal className="!size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filtrar anúncios</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6 px-4">
          <div>
            <Label>Categoria</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="1">Artísticos</SelectItem>
                <SelectItem value="2">Aventura</SelectItem>
                <SelectItem value="3">Bonecos</SelectItem>
                <SelectItem value="4">Carrinhos</SelectItem>
                <SelectItem value="5">Cartas</SelectItem>
                <SelectItem value="6">Educativos</SelectItem>
                <SelectItem value="7">Esportes</SelectItem>
                <SelectItem value="8">Estratégia</SelectItem>
                <SelectItem value="9">Palavras</SelectItem>
                <SelectItem value="10">Para bebês</SelectItem>
                <SelectItem value="11">Quebra-cabeças</SelectItem>
                <SelectItem value="12">Simulação</SelectItem>
                <SelectItem value="13">Tabuleiros</SelectItem>
                <SelectItem value="14">Videogames</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="TROCA">Troca</SelectItem>
                <SelectItem value="DOACAO">Doação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Condição</Label>
            <Select value={condicao} onValueChange={setCondicao}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="NOVO">Novo</SelectItem>
                <SelectItem value="SEMINOVO">Seminovo</SelectItem>
                <SelectItem value="USADO">Usado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter className="mt-8">
          <Button className="w-full" onClick={onAplicar}>
            Aplicar filtro
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
