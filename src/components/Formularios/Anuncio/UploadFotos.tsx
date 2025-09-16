// src/components/UploadFotos.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number; // ex.: 6
};

export default function UploadFotos({
  cloudName,
  apiKey,
  uploadPreset,
  value,
  onChange,
  max = 6,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files || !files.length) return;
    const left = max - value.length;
    const filesArr = Array.from(files).slice(0, left);
    setIsUploading(true);

    try {
      const uploaded: string[] = [];
      for (const file of filesArr) {
        // validações simples
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 5 * 1024 * 1024) {
          // 5MB (ajuste como quiser)
          console.warn(`${file.name} > 5MB, ignorado`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("api_key", apiKey);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          console.error("Falha no upload:", await res.text());
          continue;
        }
        const data = await res.json();
        if (data.secure_url) uploaded.push(data.secure_url);
      }

      if (uploaded.length) onChange([...value, ...uploaded]);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div
        className="p-4 border-2 border-dashed rounded-xl text-center cursor-pointer hover:bg-muted"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          uploadFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
          <p className="text-sm">
            Arraste imagens aqui ou <span className="underline">selecione</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Até {max} imagens • PNG/JPG • &lt; 5MB
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {value.map((url, i) => (
            <div
              key={url}
              className="relative group rounded-lg overflow-hidden border"
            >
              <Image
                src={url}
                alt={`foto-${i}`}
                width={400}
                height={400}
                className="h-28 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                aria-label="Remover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {value.length}/{max} selecionadas
      </div>

      {/* Botão alternativo para reabrir seletor */}
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading || value.length >= max}
      >
        {isUploading ? "Enviando..." : "Adicionar fotos"}
      </Button>
    </div>
  );
}
