"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
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
      {/* Area de upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
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
        <label htmlFor="file-upload" className="cursor-pointer">
          <Plus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {value.length >= max
              ? `Máximo de ${max} fotos atingido`
              : "Clique ou arraste fotos aqui"}
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG até 10MB cada</p>
        </label>
      </div>

      {/* Preview das imagens */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {value.map((file, index) => (
            <div key={index} className="relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={createPreviewUrl(file)}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  onLoad={() => {
                    // Cleanup do URL quando a imagem carregar
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
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        {value.length} de {max} fotos selecionadas
        {value.length > 0 && " • A primeira foto será a principal"}
      </p>
    </div>
  );
}
