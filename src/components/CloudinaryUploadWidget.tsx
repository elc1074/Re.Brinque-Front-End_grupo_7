"use client";

import { useEffect, useState } from "react";

interface CloudinaryUploadWidgetProps {
  children: (props: { open: () => void }) => React.ReactNode;
  onSuccess: (result: any) => void;
  cloudName: string;
  uploadPreset: string;
  apiKey: string;
  multiple?: boolean;
  cropping?: boolean;
  folder?: string;
}


export const CloudinaryUploadWidget = ({
  children,
  onSuccess,
  cloudName,
  uploadPreset,
  apiKey,
  multiple = false,
  cropping = false,
  folder,
}: CloudinaryUploadWidgetProps) => {
  const [isUploading, setIsUploading] = useState(false);

  // Upload direto via input
  const handleFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setIsUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          onSuccess({ info: { secure_url: data.secure_url }, event: "success" });
        }
      } catch (err) {
        // erro no upload
      }
    }
    setIsUploading(false);
    event.target.value = "";
  };

  // Botão para abrir widget (mantido para desktop)
  const openWidget = () => {
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          apiKey,
          sources: ["local", "url", "camera"],
          multiple,
          cropping,
          croppingAspectRatio: 1,
          showAdvancedOptions: false,
          folder,
          language: "pt",
          text: {
            "pt-BR": {
              queue: {
                title: "Fila de upload",
                title_uploading_with_counter: "Enviando {{num}} arquivos",
                title_uploading: "Enviando arquivos",
              },
              crop: {
                title: "Recortar imagem",
                crop_btn: "Recortar",
                skip_btn: "Pular",
              },
              local: {
                browse: "Procurar",
                dd_title_single: "Arraste e solte um arquivo aqui",
                dd_title_multi: "Arraste e solte os arquivos aqui",
              },
            },
          },
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            onSuccess(result);
          }
        }
      );
      widget.open();
    }
  };

  // Renderiza input e botão
  return (
    <>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: "none" }}
        id="cloudinary-upload-input"
        onChange={handleFileInput}
        disabled={isUploading}
      />
      {children({
        open: () => {
          const input = document.getElementById("cloudinary-upload-input") as HTMLInputElement;
          if (input) input.click();
        },
      })}
    </>
  );
};

export default CloudinaryUploadWidget;

declare global {
  interface Window {
    cloudinary: any;
  }
}
