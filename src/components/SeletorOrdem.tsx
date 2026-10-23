"use client";

import { useRouter } from "next/navigation";

type Props = { atual: { categoria?: string; busca?: string; ordem?: string } };

export function SeletorOrdem({ atual }: Props) {
  const router = useRouter();

  return (
    <select
      aria-label="Ordenar por"
      value={atual.ordem || "recentes"}
      onChange={(e) => {
        const sp = new URLSearchParams();
        if (atual.categoria) sp.set("categoria", atual.categoria);
        if (atual.busca) sp.set("q", atual.busca);
        if (e.target.value !== "recentes") sp.set("ordem", e.target.value);
        const qs = sp.toString();
        router.push(qs ? `/?${qs}` : "/", { scroll: false });
      }}
      className="rounded-md border border-linha bg-cartao px-4 py-3 text-sm font-medium text-tinta outline-none focus:border-tinta"
    >
      <option value="recentes">Mais recentes</option>
      <option value="menor-preco">Menor preço</option>
      <option value="maior-preco">Maior preço</option>
    </select>
  );
}
