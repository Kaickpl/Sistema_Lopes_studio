import Form from "next/form";
import Link from "next/link";
import type { Categoria } from "@/lib/types";
import type { Ordem } from "@/lib/data";
import { IconeBusca } from "./Icones";
import { SeletorOrdem } from "./SeletorOrdem";

type Props = {
  categorias: Categoria[];
  atual: { categoria?: string; busca?: string; ordem?: Ordem };
};

function montarUrl(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
  const qs = sp.toString();
  return qs ? `/?${qs}` : "/";
}

export function Filtros({ categorias, atual }: Props) {
  const chip = (ativo: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
      ativo
        ? "border-tinta bg-tinta text-papel"
        : "border-linha bg-cartao text-tinta-suave hover:border-tinta/40 hover:text-tinta"
    }`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Form action="/" scroll={false} className="relative flex-1">
          {atual.categoria && <input type="hidden" name="categoria" value={atual.categoria} />}
          {atual.ordem && <input type="hidden" name="ordem" value={atual.ordem} />}
          <IconeBusca className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-tinta-suave" />
          <input
            type="search"
            name="q"
            defaultValue={atual.busca}
            placeholder="Buscar produto..."
            className="w-full rounded-full border border-linha bg-cartao py-3 pl-11 pr-4 text-sm outline-none placeholder:text-tinta-suave/70 focus:border-tinta/50"
          />
        </Form>
        <SeletorOrdem atual={atual} />
      </div>

      <div className="sem-barra -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link
          href={montarUrl({ q: atual.busca, ordem: atual.ordem })}
          scroll={false}
          className={chip(!atual.categoria)}
        >
          Todos
        </Link>
        {categorias.map((c) => (
          <Link
            key={c.id}
            href={montarUrl({ categoria: c.slug, q: atual.busca, ordem: atual.ordem })}
            scroll={false}
            className={chip(atual.categoria === c.slug)}
          >
            {c.nome}
          </Link>
        ))}
      </div>
    </div>
  );
}
