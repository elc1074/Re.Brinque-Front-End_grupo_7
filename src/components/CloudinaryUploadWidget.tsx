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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openWidget = () => {
    if (loaded && window.cloudinary) {
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

  return children({ open: openWidget });
};

export default CloudinaryUploadWidget;

declare global {
  interface Window {
    cloudinary: any;
  }
}
