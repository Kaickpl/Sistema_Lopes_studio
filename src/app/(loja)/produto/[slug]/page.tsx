import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BotaoWhatsApp } from "@/components/BotaoWhatsApp";
import { GradeProdutos } from "@/components/CartaoProduto";
import { Galeria } from "@/components/Galeria";
import { IconeVoltar } from "@/components/Icones";
import { buscarProduto, produtosRelacionados } from "@/lib/data";
import type { Produto } from "@/lib/types";
import { formatarPreco } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const res = await buscarProduto(slug);
  if (!res) return { title: "Produto não encontrado" };
  const { produto } = res;
  return {
    title: produto.nome,
    description: produto.descricao?.slice(0, 160) || `${produto.nome} — ${formatarPreco(produto.preco)}`,
    openGraph: { images: produto.fotos.slice(0, 1) },
  };
}

export default function PaginaProduto({ params }: PageProps<"/produto/[slug]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-10">
      <Link
        href="/#catalogo"
        className="inline-flex items-center gap-2 text-sm font-medium text-tinta-suave hover:text-tinta"
      >
        <IconeVoltar /> Voltar ao catálogo
      </Link>
      <Suspense fallback={<Carregando />}>
        <DetalhesProduto params={params} />
      </Suspense>
    </div>
  );
}

async function DetalhesProduto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await buscarProduto(slug);
  if (!res) notFound();
  const { produto, colecoes } = res;

  return (
    <>
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Galeria fotos={produto.fotos} nome={produto.nome} />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {produto.categoria && (
              <Link
                href={`/?categoria=${produto.categoria.slug}#catalogo`}
                className="rounded-full border border-linha bg-cartao px-3 py-1 text-xs font-semibold uppercase tracking-wider text-tinta-suave hover:text-tinta"
              >
                {produto.categoria.nome}
              </Link>
            )}
            {colecoes.map((c) => (
              <Link
                key={c.slug}
                href={`/colecao/${c.slug}`}
                className="rounded-full bg-filamento/10 px-3 py-1 text-xs font-semibold text-filamento-escuro hover:bg-filamento/20"
              >
                {c.nome}
              </Link>
            ))}
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {produto.nome}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <p className="font-display text-3xl font-bold text-filamento">{formatarPreco(produto.preco)}</p>
            {produto.disponivel ? (
              <span className="rounded-full bg-zap/10 px-3 py-1 text-xs font-semibold text-zap-escuro">
                Pronta entrega
              </span>
            ) : (
              <span className="rounded-full bg-tinta px-3 py-1 text-xs font-semibold text-papel">Esgotado</span>
            )}
          </div>

          {produto.descricao && (
            <div className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-tinta/85">
              {produto.descricao}
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-linha bg-cartao p-5">
            <BotaoWhatsApp
              produto={{ nome: produto.nome, preco: Number(produto.preco), disponivel: produto.disponivel }}
            />
            <p className="mt-3 text-center text-xs text-tinta-suave">
              {produto.disponivel
                ? "A compra é combinada direto comigo pelo WhatsApp."
                : "Este já foi vendido, mas posso imprimir outro igual pra você."}
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <Relacionados produto={produto} />
      </Suspense>
    </>
  );
}

async function Relacionados({ produto }: { produto: Produto }) {
  const lista = await produtosRelacionados(produto);
  if (lista.length === 0) return null;
  return (
    <section className="mt-20">
      <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">Você também pode gostar</h2>
      <GradeProdutos produtos={lista} />
    </section>
  );
}

function Carregando() {
  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="aspect-square animate-pulse rounded-3xl bg-papel-2" />
      <div className="space-y-4">
        <div className="h-5 w-24 animate-pulse rounded-full bg-papel-2" />
        <div className="h-10 w-3/4 animate-pulse rounded-lg bg-papel-2" />
        <div className="h-8 w-32 animate-pulse rounded-lg bg-papel-2" />
        <div className="h-24 animate-pulse rounded-lg bg-papel-2" />
        <div className="h-16 animate-pulse rounded-2xl bg-papel-2" />
      </div>
    </div>
  );
}
