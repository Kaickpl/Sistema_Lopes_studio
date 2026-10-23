import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { GradeCarregando, GradeProdutos } from "@/components/CartaoProduto";
import { Filtros } from "@/components/Filtros";
import { IconeSeta, IconeWhatsApp } from "@/components/Icones";
import { CarrosselDestaques } from "@/components/CarrosselDestaques";
import { listarCategorias, listarColecoesAtivas, listarDestaques, listarProdutos, type Ordem } from "@/lib/data";
import { linkWhatsApp } from "@/lib/utils";

export default function PaginaInicial({ searchParams }: PageProps<"/">) {
  return (
    <>
      <Destaque />

      <Suspense fallback={null}>
        <Colecoes />
      </Suspense>

      <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-filamento">Pronta entrega</p>
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Catálogo</h2>
          </div>
        </div>
        <Suspense fallback={<GradeCarregando />}>
          <Catalogo searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

/* ---------- Topo da página ---------- */
function Destaque() {
  return (
    <section className="relative overflow-hidden border-b border-linha">
      <div className="camadas absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 grid-cols-[minmax(0,1fr)] sm:py-20 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-linha bg-cartao px-3 py-1 text-xs font-semibold text-tinta-suave">
            <span className="size-2 rounded-full bg-filamento" /> Impressão 3D feita à mão
          </p>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Peças impressas em 3D,{" "}
            <span className="text-filamento">prontas pra levar.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-tinta-suave sm:text-lg">
            Marca-páginas, suportes, brinquedos e muito mais. Escolha no catálogo e fale comigo
            direto pelo WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#catalogo"
              className="inline-flex items-center gap-2 rounded-full bg-tinta px-6 py-3.5 text-sm font-semibold text-papel hover:bg-tinta/85"
            >
              Ver catálogo <IconeSeta />
            </Link>
            <a
              href={linkWhatsApp("Olá! Gostaria de fazer uma encomenda personalizada.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-tinta/20 bg-cartao px-6 py-3.5 text-sm font-semibold hover:border-tinta/50"
            >
              <IconeWhatsApp className="size-4 text-zap" /> Encomenda personalizada
            </a>
          </div>
        </div>

        {/* Carrossel com os produtos em destaque (ou o desenho, se não houver nenhum) */}
        <Suspense fallback={<CarrosselCarregando />}>
          <DestaquesTopo />
        </Suspense>
      </div>
    </section>
  );
}

async function DestaquesTopo() {
  const destaques = await listarDestaques();
  if (destaques.length === 0) return <IlustracaoImpressora />;
  return <CarrosselDestaques produtos={destaques} />;
}

function CarrosselCarregando() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-3 h-4 w-24 animate-pulse rounded bg-papel-2" />
      <div className="overflow-hidden rounded-3xl border border-linha bg-cartao">
        <div className="aspect-[4/3] animate-pulse bg-papel-2" />
        <div className="space-y-2 p-5">
          <div className="h-5 w-2/3 animate-pulse rounded bg-papel-2" />
          <div className="h-5 w-1/4 animate-pulse rounded bg-papel-2" />
        </div>
      </div>
    </div>
  );
}

/** Desenho de peça sendo impressa — aparece enquanto não há produtos em destaque */
function IlustracaoImpressora() {
  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-sm md:block" aria-hidden>
      <div className="absolute left-1/2 top-[6%] h-[14%] w-[16%] -translate-x-1/2 rounded-b-2xl rounded-t-md bg-tinta" />
      <div className="absolute left-1/2 top-[20%] h-[5%] w-[3%] -translate-x-1/2 bg-tinta" />
      <div
        className="camadas-laranja absolute bottom-[10%] left-1/2 h-[58%] w-[62%] -translate-x-1/2"
        style={{ clipPath: "polygon(22% 0, 78% 0, 70% 18%, 92% 55%, 84% 100%, 16% 100%, 8% 55%, 30% 18%)" }}
      />
      <div className="absolute bottom-[7%] left-1/2 h-[3%] w-[86%] -translate-x-1/2 rounded-full bg-tinta/15" />
    </div>
  );
}

/* ---------- Coleções especiais (Natal, Carnaval...) ---------- */
async function Colecoes() {
  const colecoes = await listarColecoesAtivas();
  if (colecoes.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-filamento">Edições especiais</p>
      <h2 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Coleções</h2>
      <div className="sem-barra -mx-4 mt-6 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2">
        {colecoes.map((c) => (
          <Link
            key={c.id}
            href={`/colecao/${c.slug}`}
            className="group relative flex h-44 w-72 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl bg-tinta p-5 text-papel sm:w-80"
          >
            {c.capa_url ? (
              <Image
                src={c.capa_url}
                alt=""
                fill
                sizes="320px"
                className="object-cover opacity-70 transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="camadas-laranja absolute inset-0 opacity-90" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-tinta/85 via-tinta/20 to-transparent" />
            <div className="relative">
              <h3 className="font-display text-2xl font-bold leading-tight">{c.nome}</h3>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-papel/85">
                Ver coleção <IconeSeta />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Lista de produtos com filtros ---------- */
async function Catalogo({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const sp = await searchParams;
  const texto = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

  const ordemBruta = texto(sp.ordem);
  const atual = {
    categoria: texto(sp.categoria),
    busca: texto(sp.q)?.slice(0, 60),
    ordem: (["menor-preco", "maior-preco"].includes(ordemBruta ?? "") ? ordemBruta : undefined) as Ordem | undefined,
  };

  const [categorias, produtos] = await Promise.all([
    listarCategorias(),
    listarProdutos({ categoria: atual.categoria, busca: atual.busca, ordem: atual.ordem }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <Filtros categorias={categorias} atual={atual} />

      {produtos.length > 0 ? (
        <>
          <p className="text-sm text-tinta-suave">
            {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}
            {atual.busca && <> para “{atual.busca}”</>}
          </p>
          <GradeProdutos produtos={produtos} />
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-linha bg-cartao px-6 py-16 text-center">
          <p className="font-display text-xl font-semibold">Nenhum produto encontrado</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-tinta-suave">
            Não achou o que queria? Posso imprimir sob encomenda.
          </p>
          <a
            href={linkWhatsApp(
              atual.busca
                ? `Olá! Procurei por "${atual.busca}" no catálogo e não encontrei. Vocês fazem sob encomenda?`
                : "Olá! Gostaria de fazer uma encomenda personalizada.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-zap px-5 py-3 text-sm font-semibold text-white hover:bg-zap-escuro"
          >
            <IconeWhatsApp className="size-4" /> Pedir sob encomenda
          </a>
        </div>
      )}
    </div>
  );
}
