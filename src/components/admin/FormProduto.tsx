"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apagarFotos } from "@/lib/imagem";
import { supabaseNavegador } from "@/lib/supabase/client";
import type { Categoria, Colecao, Produto } from "@/lib/types";
import { gerarSlug, lerPreco } from "@/lib/utils";
import { Aviso, Campo, estilos, Interruptor, mensagemErro, Titulo } from "./ui";
import { UploaderFotos } from "./UploaderFotos";

type Estado = {
  nome: string;
  preco: string;
  descricao: string;
  categoria_id: string;
  fotos: string[];
  disponivel: boolean;
  destaque: boolean;
  colecoes: string[];
};

const VAZIO: Estado = {
  nome: "",
  preco: "",
  descricao: "",
  categoria_id: "",
  fotos: [],
  disponivel: true,
  destaque: false,
  colecoes: [],
};

export function FormProduto({ id }: { id?: string }) {
  const router = useRouter();
  const editando = !!id;

  const [form, setForm] = useState<Estado>(VAZIO);
  const [original, setOriginal] = useState<Produto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const set = <K extends keyof Estado>(k: K, v: Estado[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const sb = supabaseNavegador();
    (async () => {
      const [cats, cols] = await Promise.all([
        sb.from("categorias").select("*").order("ordem").order("nome"),
        sb.from("colecoes").select("*").order("ordem").order("nome"),
      ]);
      setCategorias((cats.data as Categoria[]) ?? []);
      setColecoes((cols.data as Colecao[]) ?? []);

      if (id) {
        const [{ data: p, error }, { data: links }] = await Promise.all([
          sb.from("produtos").select("*").eq("id", id).maybeSingle(),
          sb.from("produto_colecoes").select("colecao_id").eq("produto_id", id),
        ]);
        if (error || !p) {
          setErro(error ? mensagemErro(error) : "Produto não encontrado.");
        } else {
          const prod = p as Produto;
          setOriginal(prod);
          setForm({
            nome: prod.nome,
            preco: Number(prod.preco).toFixed(2).replace(".", ","),
            descricao: prod.descricao ?? "",
            categoria_id: prod.categoria_id ?? "",
            fotos: prod.fotos ?? [],
            disponivel: prod.disponivel,
            destaque: prod.destaque,
            colecoes: ((links as { colecao_id: string }[]) ?? []).map((l) => l.colecao_id),
          });
        }
      }
      setCarregando(false);
    })();
  }, [id]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!form.nome.trim()) return setErro("Dê um nome ao produto.");
    setSalvando(true);
    const sb = supabaseNavegador();

    const dados = {
      nome: form.nome.trim(),
      preco: lerPreco(form.preco),
      descricao: form.descricao.trim() || null,
      categoria_id: form.categoria_id || null,
      fotos: form.fotos,
      disponivel: form.disponivel,
      destaque: form.destaque,
    };

    try {
      let produtoId = id;

      if (editando) {
        const { error } = await sb.from("produtos").update(dados).eq("id", id);
        if (error) throw error;
      } else {
        // Cria o endereço (slug) a partir do nome; se já existir, acrescenta um código
        let slug = gerarSlug(dados.nome) || "produto";
        for (let tentativa = 0; tentativa < 4; tentativa++) {
          const { data, error } = await sb.from("produtos").insert({ ...dados, slug }).select("id").single();
          if (!error) {
            produtoId = data.id;
            break;
          }
          if (!/duplicate key/i.test(error.message) || tentativa === 3) throw error;
          slug = `${gerarSlug(dados.nome)}-${Math.random().toString(36).slice(2, 6)}`;
        }
      }

      // Atualiza as coleções do produto
      const { error: errDel } = await sb.from("produto_colecoes").delete().eq("produto_id", produtoId);
      if (errDel) throw errDel;
      if (form.colecoes.length > 0) {
        const { error: errIns } = await sb
          .from("produto_colecoes")
          .insert(form.colecoes.map((colecao_id) => ({ produto_id: produtoId, colecao_id })));
        if (errIns) throw errIns;
      }

      // Apaga do armazenamento as fotos que foram removidas
      if (original) {
        const removidas = original.fotos.filter((f) => !form.fotos.includes(f));
        if (removidas.length) await apagarFotos(removidas);
      }

      router.push("/admin");
      router.refresh();
    } catch (e) {
      setErro(mensagemErro(e));
      setSalvando(false);
    }
  }

  async function excluir() {
    if (!original) return;
    if (!confirm(`Excluir "${original.nome}"? Isso não pode ser desfeito.`)) return;
    setSalvando(true);
    const { error } = await supabaseNavegador().from("produtos").delete().eq("id", original.id);
    if (error) {
      setErro(mensagemErro(error));
      setSalvando(false);
      return;
    }
    await apagarFotos(Array.from(new Set([...original.fotos, ...form.fotos])));
    router.push("/admin");
    router.refresh();
  }

  if (carregando) return <p className="py-10 text-center text-sm text-tinta-suave">Carregando...</p>;

  return (
    <form onSubmit={salvar} className="flex flex-col gap-6">
      <Titulo
        acao={
          original && (
            <Link href={`/produto/${original.slug}`} target="_blank" className={estilos.botaoSecundario}>
              Ver no site ↗
            </Link>
          )
        }
      >
        {editando ? "Editar produto" : "Novo produto"}
      </Titulo>

      <section className={`${estilos.cartao} flex flex-col gap-4 p-5`}>
        <h2 className="font-display text-lg font-bold">Fotos</h2>
        <UploaderFotos fotos={form.fotos} aoMudar={(f) => set("fotos", f)} />
        <p className="text-xs text-tinta-suave">
          A primeira foto é a capa. Use as setas para mudar a ordem. As fotos são reduzidas automaticamente.
        </p>
      </section>

      <section className={`${estilos.cartao} flex flex-col gap-4 p-5`}>
        <h2 className="font-display text-lg font-bold">Informações</h2>
        <Campo rotulo="Nome do produto">
          <input
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            placeholder="Ex.: Marca-página Dragão"
            className={estilos.input}
            required
          />
        </Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Preço (R$)">
            <input
              value={form.preco}
              onChange={(e) => set("preco", e.target.value)}
              placeholder="15,90"
              inputMode="decimal"
              className={estilos.input}
            />
          </Campo>
          <Campo rotulo="Categoria" dica={categorias.length === 0 ? "Crie categorias na aba Categorias." : undefined}>
            <select
              value={form.categoria_id}
              onChange={(e) => set("categoria_id", e.target.value)}
              className={estilos.input}
            >
              <option value="">Sem categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Campo>
        </div>
        <Campo rotulo="Descrição" dica="Tamanho, cor, material, detalhes... Pode pular linhas.">
          <textarea
            value={form.descricao}
            onChange={(e) => set("descricao", e.target.value)}
            rows={6}
            placeholder={"Ex.: Impresso em PLA na cor verde.\nTamanho: 15 cm x 5 cm."}
            className={`${estilos.input} resize-y`}
          />
        </Campo>
      </section>

      <section className={`${estilos.cartao} flex flex-col gap-3 p-5`}>
        <h2 className="font-display text-lg font-bold">Situação</h2>
        <Interruptor
          ligado={form.disponivel}
          aoMudar={(v) => set("disponivel", v)}
          rotulo="Disponível"
          descricao="Desligado = aparece como “Esgotado” e o botão vira “Pedir sob encomenda”."
        />
        <Interruptor
          ligado={form.destaque}
          aoMudar={(v) => set("destaque", v)}
          rotulo="Destaque"
          descricao="Aparece primeiro no catálogo, com selo de destaque."
        />
      </section>

      <section className={`${estilos.cartao} flex flex-col gap-3 p-5`}>
        <h2 className="font-display text-lg font-bold">Coleções</h2>
        {colecoes.length === 0 ? (
          <p className="text-sm text-tinta-suave">
            Nenhuma coleção criada ainda. Crie na aba <Link href="/admin/colecoes" className="font-semibold underline">Coleções</Link> (ex.: Especial de Natal).
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {colecoes.map((c) => {
              const marcado = form.colecoes.includes(c.id);
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() =>
                    set("colecoes", marcado ? form.colecoes.filter((x) => x !== c.id) : [...form.colecoes, c.id])
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    marcado ? "border-filamento bg-filamento text-white" : "border-linha bg-white text-tinta-suave hover:border-tinta/40"
                  }`}
                >
                  {marcado ? "✓ " : ""}
                  {c.nome}
                  {!c.ativa && <span className="ml-1 opacity-70">(oculta)</span>}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-linha bg-papel/95 px-4 py-4 backdrop-blur">
        {editando ? (
          <button type="button" onClick={excluir} disabled={salvando} className={estilos.botaoPerigo}>
            Excluir
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Link href="/admin" className={estilos.botaoSecundario}>
            Cancelar
          </Link>
          <button type="submit" disabled={salvando} className={estilos.botaoLaranja}>
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar produto"}
          </button>
        </div>
      </div>
    </form>
  );
}
