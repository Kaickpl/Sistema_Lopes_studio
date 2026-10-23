"use client";

import { useCallback, useEffect, useState } from "react";
import { Aviso, estilos, mensagemErro, Titulo } from "@/components/admin/ui";
import { supabaseNavegador } from "@/lib/supabase/client";
import type { Categoria } from "@/lib/types";
import { gerarSlug } from "@/lib/utils";

export default function Categorias() {
  const [lista, setLista] = useState<Categoria[] | null>(null);
  const [nova, setNova] = useState("");
  const [editando, setEditando] = useState<{ id: string; nome: string } | null>(null);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  const carregar = useCallback(async () => {
    const { data, error } = await supabaseNavegador().from("categorias").select("*").order("ordem").order("nome");
    if (error) setErro(mensagemErro(error));
    else setLista(data as Categoria[]);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  async function executar(acao: () => PromiseLike<{ error: unknown }>) {
    setErro("");
    setOcupado(true);
    const { error } = await acao();
    setOcupado(false);
    if (error) setErro(mensagemErro(error));
    await carregar();
    return !error;
  }

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    const nome = nova.trim();
    if (!nome) return;
    const ordem = (lista?.reduce((m, c) => Math.max(m, c.ordem), 0) ?? 0) + 1;
    const ok = await executar(() =>
      supabaseNavegador().from("categorias").insert({ nome, slug: gerarSlug(nome), ordem }),
    );
    if (ok) setNova("");
  }

  async function renomear(id: string, nome: string) {
    if (!nome.trim()) return;
    const ok = await executar(() =>
      supabaseNavegador().from("categorias").update({ nome: nome.trim(), slug: gerarSlug(nome) }).eq("id", id),
    );
    if (ok) setEditando(null);
  }

  async function mover(i: number, dir: -1 | 1) {
    if (!lista) return;
    const j = i + dir;
    if (j < 0 || j >= lista.length) return;
    const nova = [...lista];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    setLista(nova);
    const sb = supabaseNavegador();
    await executar(async () => {
      const resultados = await Promise.all(
        nova.map((c, idx) => sb.from("categorias").update({ ordem: idx + 1 }).eq("id", c.id)),
      );
      return { error: resultados.find((r) => r.error)?.error ?? null };
    });
  }

  async function excluir(c: Categoria) {
    if (!confirm(`Excluir a categoria "${c.nome}"? Os produtos dela ficam "sem categoria".`)) return;
    await executar(() => supabaseNavegador().from("categorias").delete().eq("id", c.id));
  }

  return (
    <>
      <Titulo>Categorias</Titulo>
      <p className="-mt-3 mb-6 text-sm text-tinta-suave">
        Aparecem como filtros no topo do catálogo, nesta ordem.
      </p>

      <form onSubmit={adicionar} className="mb-4 flex gap-2">
        <input
          value={nova}
          onChange={(e) => setNova(e.target.value)}
          placeholder="Nova categoria (ex.: Chaveiros)"
          className={estilos.input}
        />
        <button disabled={ocupado || !nova.trim()} className={`${estilos.botaoLaranja} shrink-0`}>
          Adicionar
        </button>
      </form>

      {erro && (
        <div className="mb-4">
          <Aviso tipo="erro">{erro}</Aviso>
        </div>
      )}

      {lista === null ? (
        <p className="py-10 text-center text-sm text-tinta-suave">Carregando...</p>
      ) : lista.length === 0 ? (
        <p className={`${estilos.cartao} px-6 py-10 text-center text-sm text-tinta-suave`}>Nenhuma categoria ainda.</p>
      ) : (
        <ul className={`${estilos.cartao} divide-y divide-linha`}>
          {lista.map((c, i) => (
            <li key={c.id} className="flex items-center gap-2 p-3">
              <div className="flex flex-col">
                <button onClick={() => mover(i, -1)} disabled={i === 0 || ocupado} aria-label="Subir" className="px-2 text-tinta-suave disabled:opacity-25">▲</button>
                <button onClick={() => mover(i, 1)} disabled={i === lista.length - 1 || ocupado} aria-label="Descer" className="px-2 text-tinta-suave disabled:opacity-25">▼</button>
              </div>

              {editando?.id === c.id ? (
                <form
                  className="flex flex-1 gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void renomear(c.id, editando.nome);
                  }}
                >
                  <input
                    autoFocus
                    value={editando.nome}
                    onChange={(e) => setEditando({ id: c.id, nome: e.target.value })}
                    className={estilos.input}
                  />
                  <button className={estilos.botao} disabled={ocupado}>Salvar</button>
                  <button type="button" onClick={() => setEditando(null)} className={estilos.botaoSecundario}>✕</button>
                </form>
              ) : (
                <>
                  <span className="flex-1 font-semibold">{c.nome}</span>
                  <button onClick={() => setEditando({ id: c.id, nome: c.nome })} className="rounded-lg px-3 py-2 text-sm font-medium text-tinta-suave hover:bg-papel-2 hover:text-tinta">
                    Renomear
                  </button>
                  <button onClick={() => excluir(c)} className="rounded-lg px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                    Excluir
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
