// app/manifest.ts
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Re.Brinque",
    short_name: "Re.Brinque",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#316A41",
    theme_color: "#316A41",
    icons: [
      { src: "/assets/image.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/image.png", sizes: "512x512", type: "image/png" },
      {
        src: "/assets/image.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
