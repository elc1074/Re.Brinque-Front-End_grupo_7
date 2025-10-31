"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, ImageIcon } from "lucide-react";
import Image from "next/image";

interface PreviewFotosProps {
  value: File[];
  onChange: (files: File[]) => void;
  max?: number;
}

export default function PreviewFotos({
  value,
  onChange,
  max = 6,
}: PreviewFotosProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = [...value, ...files].slice(0, max);
    onChange(newFiles);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    const newFiles = [...value, ...files].slice(0, max);
    onChange(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const createPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          dragOver
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        } ${
          value.length >= max
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          if (value.length < max) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={value.length >= max}
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            {dragOver ? (
              <ImageIcon className="h-8 w-8 text-primary animate-bounce" />
            ) : (
              <Plus className="h-8 w-8 text-primary" />
            )}
          </div>
          <p className="text-base font-medium text-foreground mb-1">
            {value.length >= max
              ? `Máximo de ${max} fotos atingido`
              : "Adicione fotos do produto"}
          </p>
          <p className="text-sm text-muted-foreground">
            Clique ou arraste imagens aqui
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG até 10MB cada
          </p>
        </label>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {value.map((file, index) => (
            <div
              key={index}
              className="relative group animate-in fade-in zoom-in duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-muted border-2 border-border shadow-md group-hover:shadow-xl transition-all duration-300">
                <Image
                  src={createPreviewUrl(file) || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onLoad={() => {
                    if (file) {
                      setTimeout(() => {
                        URL.revokeObjectURL(createPreviewUrl(file));
                      }, 100);
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full shadow-md">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {value.length} de {max} fotos selecionadas
        </span>
        {value.length > 0 && (
          <span className="text-xs text-muted-foreground">
            A primeira foto será a principal
          </span>
        )}
      </div>
    </div>
  );
}
