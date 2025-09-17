"use client";

import { useEffect, useState } from "react";

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useCloudinaryConfig() {
  const [config, setConfig] = useState<CloudinaryConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token =
          typeof document !== "undefined"
            ? document.cookie.match(/token=([^;]+)/)?.[1]
            : undefined;
        const res = await fetch(`${API_URL}/api/cloudinary/config`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Falha ao obter config Cloudinary");
        const data = (await res.json()) as CloudinaryConfig;
        setConfig(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { config, loading, error };
}
