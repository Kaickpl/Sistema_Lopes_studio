"use client";

import Image from "next/image";
import { useState } from "react";
import { IconeCubo } from "./Icones";

export function Galeria({ fotos, nome }: { fotos: string[]; nome: string }) {
  const [atual, setAtual] = useState(0);

  if (fotos.length === 0) {
    return (
      <div className="camadas grid aspect-square place-items-center rounded-lg border border-linha bg-papel-2 text-tinta-suave/50">
        <IconeCubo className="size-20" />
      </div>
    );
  }

  const anterior = () => setAtual((i) => (i - 1 + fotos.length) % fotos.length);
  const proxima = () => setAtual((i) => (i + 1) % fotos.length);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-linha bg-papel-2">
        <Image
          key={fotos[atual]}
          src={fotos[atual]}
          alt={`${nome} — foto ${atual + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {fotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={anterior}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-md bg-cartao/90 text-xl shadow hover:bg-tinta hover:text-papel"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={proxima}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-md bg-cartao/90 text-xl shadow hover:bg-tinta hover:text-papel"
            >
              ›
            </button>
            <span className="absolute bottom-3 right-3 rounded-sm bg-tinta/85 px-2 py-1 text-xs font-bold text-papel">
              {atual + 1} / {fotos.length}
            </span>
          </>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="sem-barra flex gap-2 overflow-x-auto">
          {fotos.map((foto, i) => (
            <button
              key={foto}
              type="button"
              onClick={() => setAtual(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`relative size-20 shrink-0 overflow-hidden rounded-md border-2 transition ${
                i === atual ? "border-filamento" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={foto} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
