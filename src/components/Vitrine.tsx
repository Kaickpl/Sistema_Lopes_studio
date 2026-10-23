"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import type { Produto } from "@/lib/types";
import { formatarPreco } from "@/lib/utils";
import { IconePausar, IconeSeta, IconeTocar, IconeVoltar } from "./Icones";

/** Tempo que cada destaque fica na tela (é o tempo que a barrinha vermelha leva para encher) */
const INTERVALO_MS = 6000;

const MOVIMENTO_REDUZIDO = "(prefers-reduced-motion: reduce)";

function useMovimentoReduzido() {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(MOVIMENTO_REDUZIDO);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(MOVIMENTO_REDUZIDO).matches,
    () => false,
  );
}

/**
 * Carrossel de novidades da página inicial (no estilo das vitrines da Steam):
 * passa sozinho, pausa com o mouse em cima ou no botão de pausa, e dá para
 * escolher pelas barrinhas, pelas setas ou arrastando no celular.
 */
export function Vitrine({ produtos, className = "" }: { produtos: Produto[]; className?: string }) {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [mouseEmCima, setMouseEmCima] = useState(false);
  const [focoTeclado, setFocoTeclado] = useState(false);
  const semAnimacao = useMovimentoReduzido();
  const toqueX = useRef<number | null>(null);

  const total = produtos.length;
  const passando = total > 1 && !pausado && !mouseEmCima && !focoTeclado && !semAnimacao;
  const irPara = (i: number) => setAtual(((i % total) + total) % total);

  const botao =
    "grid size-10 shrink-0 place-items-center rounded-md border border-tinta/20 text-tinta transition hover:border-tinta hover:bg-tinta hover:text-papel";

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Novidades"
      className={className}
      onPointerEnter={(e) => e.pointerType === "mouse" && setMouseEmCima(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setMouseEmCima(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setFocoTeclado(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocoTeclado(false);
      }}
    >
      <div
        className="overflow-hidden rounded-lg bg-tinta text-papel shadow-[0_24px_50px_-28px_rgba(23,23,27,0.7)]"
        onTouchStart={(e) => (toqueX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (toqueX.current === null) return;
          const distancia = e.changedTouches[0].clientX - toqueX.current;
          toqueX.current = null;
          if (Math.abs(distancia) > 50) irPara(atual + (distancia < 0 ? 1 : -1));
        }}
      >
        {/* Todos os destaques ficam empilhados no mesmo lugar; só o atual aparece */}
        <div className="grid" aria-live={passando ? "off" : "polite"}>
          {produtos.map((p, i) => (
            <Slide
              key={p.id}
              produto={p}
              ativo={i === atual}
              rotulo={`${i + 1} de ${total}`}
              prioridade={i === 0}
            />
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="mt-4 flex items-center gap-4">
          <div className="flex flex-1 gap-2">
            {produtos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Mostrar ${p.nome}`}
                aria-current={i === atual}
                className="group flex h-8 max-w-20 flex-1 items-center"
              >
                <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-tinta/15 transition group-hover:bg-tinta/30">
                  {i === atual &&
                    (semAnimacao ? (
                      <span className="absolute inset-0 bg-filamento" />
                    ) : (
                      <span
                        key={atual}
                        className="progresso-vitrine absolute inset-0 bg-filamento"
                        style={{
                          animationDuration: `${INTERVALO_MS}ms`,
                          animationPlayState: passando ? "running" : "paused",
                        }}
                        onAnimationEnd={() => irPara(atual + 1)}
                      />
                    ))}
                </span>
              </button>
            ))}
          </div>

          {!semAnimacao && (
            <button
              type="button"
              onClick={() => setPausado((v) => !v)}
              aria-label={pausado ? "Continuar passando" : "Pausar"}
              className={botao}
            >
              {pausado ? <IconeTocar /> : <IconePausar />}
            </button>
          )}
          <button type="button" onClick={() => irPara(atual - 1)} aria-label="Anterior" className={botao}>
            <IconeVoltar />
          </button>
          <button type="button" onClick={() => irPara(atual + 1)} aria-label="Próximo" className={botao}>
            <IconeSeta />
          </button>
        </div>
      )}
    </div>
  );
}

function Slide({
  produto,
  ativo,
  rotulo,
  prioridade,
}: {
  produto: Produto;
  ativo: boolean;
  rotulo: string;
  prioridade: boolean;
}) {
  const [foto, setFoto] = useState(0);
  const fotos = produto.fotos.slice(0, 4);
  const href = `/produto/${produto.slug}`;

  return (
    <div
      role="group"
      aria-roledescription="destaque"
      aria-label={rotulo}
      inert={!ativo}
      className={`col-start-1 row-start-1 grid transition-opacity motion-reduce:transition-none md:grid-cols-[1.45fr_1fr] ${
        // o que sai some rápido e o que entra aparece logo depois, sem os textos se sobreporem
        ativo ? "opacity-100 delay-150 duration-500" : "pointer-events-none opacity-0 duration-200"
      }`}
    >
      <Link href={href} tabIndex={-1} className="relative block aspect-[4/3] overflow-hidden bg-papel-2 md:aspect-[16/11]">
        <Image
          key={fotos[foto]}
          src={fotos[foto]}
          alt={produto.nome}
          fill
          priority={prioridade}
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-col p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="rounded-sm bg-filamento-escuro px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
            {produto.destaque ? "Destaque" : "Novidade"}
          </span>
          {produto.categoria?.nome && (
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-papel/60">
              {produto.categoria.nome}
            </span>
          )}
        </div>

        <h3 className="mt-4 line-clamp-3 font-display text-2xl font-black uppercase leading-[1.05] tracking-tight sm:text-3xl">
          <Link href={href} className="transition hover:text-filamento">
            {produto.nome}
          </Link>
        </h3>

        {produto.descricao && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-papel/70">{produto.descricao}</p>
        )}

        {/* Miniaturas: passar o mouse (ou tocar) troca a foto grande */}
        {fotos.length > 1 && (
          <div className="mt-5 flex gap-2">
            {fotos.map((f, i) => (
              <button
                key={f}
                type="button"
                onPointerEnter={() => setFoto(i)}
                onFocus={() => setFoto(i)}
                onClick={() => setFoto(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={`relative size-14 overflow-hidden rounded-md border-2 transition ${
                  i === foto ? "border-filamento" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={f} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 md:mt-auto md:pt-6">
          <p className="font-display text-2xl font-black">{formatarPreco(produto.preco)}</p>
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-md bg-papel px-5 py-3 text-xs font-bold uppercase tracking-wider text-tinta transition hover:bg-filamento-escuro hover:text-white"
          >
            Ver produto <IconeSeta />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function VitrineCarregando() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14" aria-hidden>
      <div className="h-4 w-36 animate-pulse rounded bg-papel-2" />
      <div className="mt-3 h-9 w-56 animate-pulse rounded bg-papel-2" />
      <div className="mt-6 aspect-[5/9] animate-pulse rounded-lg bg-papel-2 sm:aspect-[4/5] md:aspect-[16/6.5]" />
    </section>
  );
}
