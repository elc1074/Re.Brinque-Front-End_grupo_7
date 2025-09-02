import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Re.Brinque",
    short_name: "Re.Brinque",
    start_url: "/",
    lang: "pt-BR",
    description: "Aplicativo de doação e troca de brinquedos",
    display: "standalone",
    background_color: "#316A41",
    theme_color: "#316A41",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
