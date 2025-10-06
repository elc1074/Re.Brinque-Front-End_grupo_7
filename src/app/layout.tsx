"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // Registrar o service worker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .catch(() => {});
      }

      // Script do Microsoft Clarity com rest parameters
      const clarityScript = document.createElement("script");
      clarityScript.type = "text/javascript";
      clarityScript.async = true;
      clarityScript.text = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(...args){(c[a].q=c[a].q||[]).push(args)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "tlnr9h46r7");
      `;
      document.head.appendChild(clarityScript);
    }
  }, []);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
