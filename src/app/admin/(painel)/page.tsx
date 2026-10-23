"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Aviso, estilos, mensagemErro, Titulo } from "@/components/admin/ui";
import { IconeBusca, IconeCubo } from "@/components/Icones";
import { supabaseNavegador } from "@/lib/supabase/client";
import type { Produto } from "@/lib/types";
import { formatarPreco } from "@/lib/utils";

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[] | null>(null);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    const { data, error } = await supabaseNavegador()
      .from("produtos")
      .select("*, categoria:categorias(nome, slug)")
      .order("criado_em", { ascending: false });
    if (error) setErro(mensagemErro(error));
    else setProdutos(data as Produto[]);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  async function alternarDisponivel(p: Produto) {
    setProdutos((lista) => lista?.map((x) => (x.id === p.id ? { ...x, disponivel: !x.disponivel } : x)) ?? null);
    const { error } = await supabaseNavegador()
      .from("produtos")
      .update({ disponivel: !p.disponivel })
      .eq("id", p.id);
    if (error) {
      setErro(mensagemErro(error));
      void carregar();
    }
  }

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return (produtos ?? []).filter((p) => !t || p.nome.toLowerCase().includes(t));
  }, [produtos, busca]);

  return (
    <>
      <Titulo
        acao={
          <Link href="/admin/produtos/novo" className={estilos.botaoLaranja}>
            + Novo produto
          </Link>
        }
      >
        Produtos
      </Titulo>

      {erro && (
        <div className="mb-4">
          <Aviso tipo="erro">{erro}</Aviso>
        </div>
      )}

      <div className="relative mb-4">
        <IconeBusca className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-tinta-suave" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar pelo nome..."
          className={`${estilos.input} pl-10`}
        />
      </div>

      {produtos === null ? (
        <p className="py-10 text-center text-sm text-tinta-suave">Carregando...</p>
      ) : filtrados.length === 0 ? (
        <div className={`${estilos.cartao} px-6 py-14 text-center`}>
          <p className="font-display text-lg font-semibold">
            {produtos.length === 0 ? "Nenhum produto cadastrado ainda" : "Nada encontrado"}
          </p>
          {produtos.length === 0 && (
            <Link href="/admin/produtos/novo" className={`${estilos.botaoLaranja} mt-4`}>
              Cadastrar o primeiro produto
            </Link>
          )}
        </div>
      ) : (
        <ul className={`${estilos.cartao} divide-y divide-linha overflow-hidden`}>
          {filtrados.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
              <Link
                href={`/admin/produtos/${p.id}`}
                className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-papel-2 sm:size-16"
              >
                {p.fotos[0] ? (
                  <Image src={p.fotos[0]} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <span className="grid h-full place-items-center text-tinta-suave/50">
                    <IconeCubo />
                  </span>
                )}
              </Link>
              <Link href={`/admin/produtos/${p.id}`} className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {p.nome}
                  {p.destaque && <span className="ml-2 text-xs font-semibold text-filamento">★ destaque</span>}
                </p>
                <p className="text-sm text-tinta-suave">
                  {formatarPreco(p.preco)}
                  {p.categoria?.nome && <> · {p.categoria.nome}</>}
                  {" · "}
                  {p.fotos.length} {p.fotos.length === 1 ? "foto" : "fotos"}
                </p>
              </Link>
              <button
                onClick={() => alternarDisponivel(p)}
                title="Clique para alternar"
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  p.disponivel ? "bg-green-100 text-green-800" : "bg-tinta text-papel"
                }`}
              >
                {p.disponivel ? "Disponível" : "Esgotado"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
