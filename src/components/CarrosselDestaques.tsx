"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Produto } from "@/lib/types";
import { formatarPreco } from "@/lib/utils";
import { IconeCubo, IconeSeta } from "./Icones";

const INTERVALO_MS = 4500;

/**
 * Carrossel do topo da página: mostra os produtos marcados como
 * "Destaque" no painel e passa sozinho a cada 4,5 segundos.
 * Pausa quando o mouse está em cima e aceita arrastar no celular.
 */
export function CarrosselDestaques({ produtos }: { produtos: Produto[] }) {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const toqueInicio = useRef<number | null>(null);
  const total = produtos.length;

  const irPara = useCallback((i: number) => setAtual(((i % total) + total) % total), [total]);

  useEffect(() => {
    if (total < 2 || pausado) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setAtual((i) => (i + 1) % total), INTERVALO_MS);
    return () => window.clearInterval(id);
  }, [total, pausado]);

  if (total === 0) return null;

  return (
    <div
      className="relative mx-auto w-full min-w-0 max-w-md"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
      onTouchStart={(e) => {
        toqueInicio.current = e.touches[0].clientX;
        setPausado(true);
      }}
      onTouchEnd={(e) => {
        const inicio = toqueInicio.current;
        toqueInicio.current = null;
        setPausado(false);
        if (inicio === null) return;
        const delta = e.changedTouches[0].clientX - inicio;
        if (Math.abs(delta) > 40) irPara(atual + (delta < 0 ? 1 : -1));
      }}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Produtos em destaque"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-filamento">
          <span className="size-2 animate-pulse rounded-full bg-filamento" /> Destaques
        </span>
        {total > 1 && (
          <span className="text-xs font-medium tabular-nums text-tinta-suave">
            {atual + 1} / {total}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-linha bg-cartao shadow-[0_24px_50px_-24px_rgba(29,27,25,0.35)]">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${atual * 100}%)` }}
        >
          {produtos.map((p, i) => (
            <Link
              key={p.id}
              href={`/produto/${p.slug}`}
              className="group block w-full shrink-0"
              aria-hidden={i !== atual}
              tabIndex={i === atual ? 0 : -1}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-papel-2">
                {p.fotos[0] ? (
                  <Image
                    src={p.fotos[0]}
                    alt={p.nome}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="camadas grid h-full place-items-center text-tinta-suave/50">
                    <IconeCubo className="size-16" />
                  </div>
                )}
                {!p.disponivel && (
                  <span className="absolute left-3 top-3 rounded-full bg-tinta px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-papel">
                    Esgotado
                  </span>
                )}
              </div>
              <div className="flex items-end justify-between gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  {p.categoria?.nome && (
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-tinta-suave">
                      {p.categoria.nome}
                    </p>
                  )}
                  <p className="truncate font-display text-lg font-bold leading-snug sm:text-xl">{p.nome}</p>
                  <p className="mt-0.5 font-display text-lg font-bold text-filamento">{formatarPreco(p.preco)}</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-tinta text-papel transition group-hover:bg-filamento">
                  <IconeSeta />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => irPara(atual - 1)}
            aria-label="Destaque anterior"
            className="grid size-9 place-items-center rounded-full border border-linha bg-cartao text-lg hover:border-tinta/40"
          >
            ‹
          </button>
          <div className="flex items-center gap-1.5">
            {produtos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Ver destaque ${i + 1}`}
                aria-current={i === atual}
                className={`h-2 rounded-full transition-all ${i === atual ? "w-6 bg-filamento" : "w-2 bg-tinta/20 hover:bg-tinta/40"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => irPara(atual + 1)}
            aria-label="Próximo destaque"
            className="grid size-9 place-items-center rounded-full border border-linha bg-cartao text-lg hover:border-tinta/40"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
