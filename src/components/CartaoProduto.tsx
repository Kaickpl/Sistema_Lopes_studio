import Image from "next/image";
import Link from "next/link";
import type { Produto } from "@/lib/types";
import { formatarPreco } from "@/lib/utils";
import { IconeCubo } from "./Icones";

export function CartaoProduto({ produto, prioridade = false }: { produto: Produto; prioridade?: boolean }) {
  const capa = produto.fotos?.[0];

  return (
    <Link
      href={`/produto/${produto.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-linha bg-cartao transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(29,27,25,0.25)]"
    >
      <div className="relative aspect-square overflow-hidden bg-papel-2">
        {capa ? (
          <Image
            src={capa}
            alt={produto.nome}
            fill
            priority={prioridade}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition duration-500 group-hover:scale-[1.04] ${produto.disponivel ? "" : "grayscale-[60%] opacity-80"}`}
          />
        ) : (
          <div className="camadas grid h-full place-items-center text-tinta-suave/50">
            <IconeCubo className="size-12" />
          </div>
        )}

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {!produto.disponivel && (
            <span className="rounded-full bg-tinta px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-papel">
              Esgotado
            </span>
          )}
          {produto.disponivel && produto.destaque && (
            <span className="rounded-full bg-filamento px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              Destaque
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        {produto.categoria?.nome && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-tinta-suave">
            {produto.categoria.nome}
          </span>
        )}
        <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug sm:text-base">
          {produto.nome}
        </h3>
        <p className="mt-auto pt-2 font-display text-lg font-bold text-filamento">
          {formatarPreco(produto.preco)}
        </p>
      </div>
    </Link>
  );
}

export function GradeProdutos({ produtos }: { produtos: Produto[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {produtos.map((p, i) => (
        <CartaoProduto key={p.id} produto={p} prioridade={i < 4} />
      ))}
    </div>
  );
}

export function GradeCarregando({ quantidade = 8 }: { quantidade?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: quantidade }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-linha bg-cartao">
          <div className="aspect-square animate-pulse bg-papel-2" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-papel-2" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-papel-2" />
            <div className="h-5 w-1/4 animate-pulse rounded bg-papel-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
