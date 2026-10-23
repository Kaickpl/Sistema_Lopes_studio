"use client";

import type { ReactNode } from "react";

export const estilos = {
  input:
    "w-full rounded-xl border border-linha bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-tinta-suave/60 focus:border-filamento focus:ring-2 focus:ring-filamento/15",
  botao:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-tinta px-4 py-2.5 text-sm font-semibold text-papel transition hover:bg-tinta/85 disabled:cursor-not-allowed disabled:opacity-50",
  botaoVermelho:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-filamento px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-filamento-escuro disabled:cursor-not-allowed disabled:opacity-50",
  botaoSecundario:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-linha bg-white px-4 py-2.5 text-sm font-semibold text-tinta transition hover:border-tinta/40 disabled:opacity-50",
  botaoPerigo:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50",
  cartao: "rounded-2xl border border-linha bg-cartao",
};

export function Campo({ rotulo, dica, children }: { rotulo: string; dica?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{rotulo}</span>
      {children}
      {dica && <span className="text-xs text-tinta-suave">{dica}</span>}
    </label>
  );
}

export function Interruptor({
  ligado,
  aoMudar,
  rotulo,
  descricao,
}: {
  ligado: boolean;
  aoMudar: (v: boolean) => void;
  rotulo: string;
  descricao?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      onClick={() => aoMudar(!ligado)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-linha bg-white px-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm font-semibold">{rotulo}</span>
        {descricao && <span className="block text-xs text-tinta-suave">{descricao}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${ligado ? "bg-filamento" : "bg-linha"}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${ligado ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

export function Aviso({ tipo, children }: { tipo: "erro" | "ok"; children: ReactNode }) {
  return (
    <div
      role="status"
      className={`rounded-xl px-4 py-3 text-sm font-medium ${
        tipo === "erro" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
      }`}
    >
      {children}
    </div>
  );
}

export function Titulo({ children, acao }: { children: ReactNode; acao?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{children}</h1>
      {acao}
    </div>
  );
}

/** Traduz os erros mais comuns do Supabase */
export function mensagemErro(e: unknown): string {
  const msg = e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : String(e);
  if (/row-level security|permission denied|violates row-level/i.test(msg))
    return "Sem permissão. Confira se o seu usuário foi adicionado na tabela 'admins' (veja o guia).";
  if (/duplicate key/i.test(msg)) return "Já existe um item com esse nome/endereço. Tente outro nome.";
  if (/Failed to fetch|NetworkError/i.test(msg)) return "Sem conexão com o servidor. Verifique sua internet.";
  return msg;
}
