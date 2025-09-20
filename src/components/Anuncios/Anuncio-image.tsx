"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type AnuncioImagem = {
  url_imagem: string;
  principal?: boolean;
  alt?: string;
};

export default function ImageCarousel({
  imagens,
  titulo = "Imagens do anúncio",
}: {
  imagens: AnuncioImagem[];
  titulo?: string;
}) {
  const ordered = useMemo(() => {
    if (!Array.isArray(imagens)) return [];
    const withIndex = imagens
      .filter((i) => i && typeof i.url_imagem === "string")
      .map((i) => ({ ...i, principal: !!i.principal }));
    withIndex.sort((a, b) => Number(b.principal) - Number(a.principal));
    return withIndex;
  }, [imagens]);

  const hasImages = ordered.length > 0;
  const [index, setIndex] = useState(() =>
    Math.max(0, ordered.findIndex((i) => i.principal) || 0)
  );

  const trackRef = useRef<HTMLDivElement>(null);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(ordered.length - 1, i + 1));

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== index) setIndex(i);
  };

  if (!hasImages) {
    return (
      <div className="p-4 max-w-sm mx-auto w-full pb-44">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <span className="text-sm">Sem imagem</span>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div
        className="relative aspect-square overflow-hidden rounded-lg"
        aria-roledescription="carousel"
        aria-label={titulo}
      >
        {/* Trilho com scroll horizontal e snap por slide */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x select-none
                     [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
          }}
        >
          {ordered.map((img, i) => (
            <div
              key={i}
              className="relative w-full h-full flex-shrink-0 snap-center"
            >
              <Image
                src={img.url_imagem}
                alt={img.alt || `${titulo} - ${i + 1}/${ordered.length}`}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
                draggable={false}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        {/* Indicadores */}
        {ordered.length > 1 && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
            {ordered.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir para imagem ${i + 1}`}
                onClick={() => setIndex(i)}
                className={` transition
                  ${
                    i === index
                      ? "bg-white rounded-2xl h-2.5 w-6"
                      : "bg-white/50 hover:bg-white/80 h-2.5 w-2.5 rounded-full"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
  );
}
