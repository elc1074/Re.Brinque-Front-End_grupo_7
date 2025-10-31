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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
        <Button
          variant="outline"
          size="icon"
          className="ml-2 h-12 w-12 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 shadow-sm"
        >
          <SlidersHorizontal className="!size-5 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="text-xl font-bold">
            Filtrar anúncios
          </SheetTitle>
          <p className="text-sm text-muted-foreground">Refine sua busca</p>
        </SheetHeader>
        <div className="space-y-6 mt-8 px-1">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">
              Categoria
            </Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger className="w-full h-11 rounded-xl border-zinc-200 dark:border-zinc-700">
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
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">
              Tipo
            </Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-full h-11 rounded-xl border-zinc-200 dark:border-zinc-700">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="TROCA">Troca</SelectItem>
                <SelectItem value="DOACAO">Doação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">
              Condição
            </Label>
            <Select value={condicao} onValueChange={setCondicao}>
              <SelectTrigger className="w-full h-11 rounded-xl border-zinc-200 dark:border-zinc-700">
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
        <SheetFooter className="mt-8 pt-6 border-t">
          <Button
            className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={onAplicar}
          >
            Aplicar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
