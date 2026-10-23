"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Aviso, Campo, estilos, Interruptor, mensagemErro, Titulo } from "@/components/admin/ui";
import { UploaderFotos } from "@/components/admin/UploaderFotos";
import { apagarFotos } from "@/lib/imagem";
import { supabaseNavegador } from "@/lib/supabase/client";
import type { Colecao } from "@/lib/types";
import { gerarSlug } from "@/lib/utils";

type ColecaoComContagem = Colecao & { produto_colecoes: { count: number }[] };

type Rascunho = { id?: string; nome: string; descricao: string; capa_url: string | null; ativa: boolean };

const NOVA: Rascunho = { nome: "", descricao: "", capa_url: null, ativa: true };

export default function Colecoes() {
  const [lista, setLista] = useState<ColecaoComContagem[] | null>(null);
  const [rascunho, setRascunho] = useState<Rascunho | null>(null);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    const { data, error } = await supabaseNavegador()
      .from("colecoes")
      .select("*, produto_colecoes(count)")
      .order("ordem")
      .order("criado_em", { ascending: false });
    if (error) setErro(mensagemErro(error));
    else setLista(data as ColecaoComContagem[]);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!rascunho?.nome.trim()) return setErro("Dê um nome à coleção.");
    setErro("");
    setSalvando(true);
    const sb = supabaseNavegador();
    const dados = {
      nome: rascunho.nome.trim(),
      slug: gerarSlug(rascunho.nome),
      descricao: rascunho.descricao.trim() || null,
      capa_url: rascunho.capa_url,
      ativa: rascunho.ativa,
    };
    const antiga = lista?.find((c) => c.id === rascunho.id);
    const { error } = rascunho.id
      ? await sb.from("colecoes").update(dados).eq("id", rascunho.id)
      : await sb.from("colecoes").insert(dados);
    setSalvando(false);
    if (error) return setErro(mensagemErro(error));
    if (antiga?.capa_url && antiga.capa_url !== rascunho.capa_url) await apagarFotos([antiga.capa_url]);
    setRascunho(null);
    await carregar();
  }

  async function alternarAtiva(c: Colecao) {
    const { error } = await supabaseNavegador().from("colecoes").update({ ativa: !c.ativa }).eq("id", c.id);
    if (error) setErro(mensagemErro(error));
    await carregar();
  }

  async function excluir(c: Colecao) {
    if (!confirm(`Excluir a coleção "${c.nome}"? Os produtos continuam no catálogo.`)) return;
    const { error } = await supabaseNavegador().from("colecoes").delete().eq("id", c.id);
    if (error) return setErro(mensagemErro(error));
    if (c.capa_url) await apagarFotos([c.capa_url]);
    await carregar();
  }

  return (
    <>
      <Titulo
        acao={
          !rascunho && (
            <button onClick={() => setRascunho(NOVA)} className={estilos.botaoVermelho}>
              + Nova coleção
            </button>
          )
        }
      >
        Coleções
      </Titulo>
      <p className="-mt-3 mb-6 text-sm text-tinta-suave">
        Ex.: Especial de Natal, Ano Novo, Carnaval. Coleções ativas aparecem na página inicial. Para colocar
        produtos numa coleção, edite o produto e marque a coleção.
      </p>

      {erro && (
        <div className="mb-4">
          <Aviso tipo="erro">{erro}</Aviso>
        </div>
      )}

      {rascunho && (
        <form onSubmit={salvar} className={`${estilos.cartao} mb-6 flex flex-col gap-4 p-5`}>
          <h2 className="font-display text-lg font-bold">{rascunho.id ? "Editar coleção" : "Nova coleção"}</h2>
          <Campo rotulo="Nome">
            <input
              autoFocus
              value={rascunho.nome}
              onChange={(e) => setRascunho({ ...rascunho, nome: e.target.value })}
              placeholder="Especial de Natal"
              className={estilos.input}
            />
          </Campo>
          <Campo rotulo="Descrição (opcional)">
            <textarea
              rows={3}
              value={rascunho.descricao}
              onChange={(e) => setRascunho({ ...rascunho, descricao: e.target.value })}
              placeholder="Enfeites e presentes impressos em 3D para o Natal."
              className={`${estilos.input} resize-y`}
            />
          </Campo>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Imagem de capa (opcional)</span>
            <div className="max-w-xs">
              <UploaderFotos
                pasta="colecoes"
                maximo={1}
                fotos={rascunho.capa_url ? [rascunho.capa_url] : []}
                aoMudar={(f) => setRascunho({ ...rascunho, capa_url: f[0] ?? null })}
              />
            </div>
            <span className="text-xs text-tinta-suave">Sem imagem, a coleção usa um fundo laranja listrado.</span>
          </div>
          <Interruptor
            ligado={rascunho.ativa}
            aoMudar={(v) => setRascunho({ ...rascunho, ativa: v })}
            rotulo="Ativa (visível no site)"
            descricao="Desligue quando a data passar — os produtos continuam no catálogo normal."
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setRascunho(null)} className={estilos.botaoSecundario}>
              Cancelar
            </button>
            <button disabled={salvando} className={estilos.botaoVermelho}>
              {salvando ? "Salvando..." : "Salvar coleção"}
            </button>
          </div>
        </form>
      )}

      {lista === null ? (
        <p className="py-10 text-center text-sm text-tinta-suave">Carregando...</p>
      ) : lista.length === 0 ? (
        !rascunho && (
          <p className={`${estilos.cartao} px-6 py-10 text-center text-sm text-tinta-suave`}>
            Nenhuma coleção ainda.
          </p>
        )
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {lista.map((c) => {
            const qtd = c.produto_colecoes?.[0]?.count ?? 0;
            return (
              <li key={c.id} className={`${estilos.cartao} flex flex-col overflow-hidden`}>
                <div className="relative h-28 bg-tinta">
                  {c.capa_url ? (
                    <Image src={c.capa_url} alt="" fill sizes="400px" className="object-cover opacity-80" />
                  ) : (
                    <div className="camadas-vermelho absolute inset-0" />
                  )}
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      c.ativa ? "bg-green-100 text-green-800" : "bg-white/90 text-tinta-suave"
                    }`}
                  >
                    {c.ativa ? "Ativa" : "Oculta"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <p className="font-display text-lg font-bold">{c.nome}</p>
                  <p className="text-sm text-tinta-suave">
                    {qtd} {qtd === 1 ? "produto" : "produtos"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <button
                      onClick={() =>
                        setRascunho({ id: c.id, nome: c.nome, descricao: c.descricao ?? "", capa_url: c.capa_url, ativa: c.ativa })
                      }
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-papel-2"
                    >
                      Editar
                    </button>
                    <button onClick={() => alternarAtiva(c)} className="rounded-lg px-3 py-2 text-sm font-medium text-tinta-suave hover:bg-papel-2">
                      {c.ativa ? "Ocultar" : "Ativar"}
                    </button>
                    {c.ativa && (
                      <Link href={`/colecao/${c.slug}`} target="_blank" className="rounded-lg px-3 py-2 text-sm font-medium text-tinta-suave hover:bg-papel-2">
                        Ver ↗
                      </Link>
                    )}
                    <button onClick={() => excluir(c)} className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
