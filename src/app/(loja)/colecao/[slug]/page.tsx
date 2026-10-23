import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GradeCarregando, GradeProdutos } from "@/components/CartaoProduto";
import { IconeVoltar } from "@/components/Icones";
import { buscarColecao, listarProdutos } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/colecao/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const colecao = await buscarColecao(slug);
  if (!colecao) return { title: "Coleção não encontrada" };
  return { title: colecao.nome, description: colecao.descricao ?? undefined };
}

export default function PaginaColecao({ params }: PageProps<"/colecao/[slug]">) {
  return (
    <Suspense fallback={<Carregando />}>
      <Conteudo params={params} />
    </Suspense>
  );
}

async function Conteudo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const colecao = await buscarColecao(slug);
  if (!colecao) notFound();
  const produtos = await listarProdutos({ colecaoId: colecao.id });

  return (
    <>
      <section className="relative overflow-hidden bg-tinta text-papel">
        {colecao.capa_url ? (
          <Image src={colecao.capa_url} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
        ) : (
          <div className="camadas-laranja absolute inset-0 opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-tinta/80 to-tinta/10" />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-8 sm:pb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-papel/80 hover:text-papel">
            <IconeVoltar /> Início
          </Link>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-papel/80">Coleção especial</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{colecao.nome}</h1>
          {colecao.descricao && (
            <p className="mt-4 max-w-xl whitespace-pre-line text-papel/85 sm:text-lg">{colecao.descricao}</p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-10">
        {produtos.length > 0 ? (
          <GradeProdutos produtos={produtos} />
        ) : (
          <p className="rounded-3xl border border-dashed border-linha bg-cartao px-6 py-16 text-center text-tinta-suave">
            Os produtos desta coleção estão chegando. Volte em breve!
          </p>
        )}
      </div>
    </>
  );
}

function Carregando() {
  return (
    <>
      <div className="h-64 animate-pulse bg-papel-2" />
      <div className="mx-auto max-w-6xl px-4 pt-10">
        <GradeCarregando />
      </div>
    </>
  );
}
