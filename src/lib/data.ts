import "server-only";
import { connection } from "next/server";
import { supabasePublico } from "./supabase/public";
import type { Categoria, Colecao, Produto } from "./types";

// Todas as leituras acontecem na hora da visita (sem cache),
// assim o que você muda no painel aparece no site na mesma hora.

const CAMPOS_PRODUTO =
  "id, nome, slug, descricao, preco, fotos, categoria_id, disponivel, destaque, criado_em, categoria:categorias(nome, slug)";

export type Ordem = "recentes" | "menor-preco" | "maior-preco";

export async function listarCategorias(): Promise<Categoria[]> {
  await connection();
  const { data, error } = await supabasePublico()
    .from("categorias")
    .select("id, nome, slug, ordem")
    .order("ordem")
    .order("nome");
  if (error) throw error;
  return data ?? [];
}

export async function listarColecoesAtivas(): Promise<Colecao[]> {
  await connection();
  const { data, error } = await supabasePublico()
    .from("colecoes")
    .select("*")
    .eq("ativa", true)
    .order("ordem")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function buscarColecao(slug: string): Promise<Colecao | null> {
  await connection();
  const { data, error } = await supabasePublico()
    .from("colecoes")
    .select("*")
    .eq("slug", slug)
    .eq("ativa", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listarProdutos(filtros: {
  categoria?: string;
  colecaoId?: string;
  busca?: string;
  ordem?: Ordem;
} = {}): Promise<Produto[]> {
  await connection();
  const sb = supabasePublico();

  let query = sb.from("produtos").select(CAMPOS_PRODUTO);

  if (filtros.categoria) {
    const { data: cat } = await sb
      .from("categorias")
      .select("id")
      .eq("slug", filtros.categoria)
      .maybeSingle();
    if (!cat) return [];
    query = query.eq("categoria_id", cat.id);
  }

  if (filtros.colecaoId) {
    const { data: links } = await sb
      .from("produto_colecoes")
      .select("produto_id")
      .eq("colecao_id", filtros.colecaoId);
    const ids = (links ?? []).map((l) => l.produto_id as string);
    if (ids.length === 0) return [];
    query = query.in("id", ids);
  }

  if (filtros.busca) {
    const termo = filtros.busca.replace(/[%,()]/g, " ").trim();
    if (termo) query = query.or(`nome.ilike.%${termo}%,descricao.ilike.%${termo}%`);
  }

  query = query.order("disponivel", { ascending: false });
  if (filtros.ordem === "menor-preco") query = query.order("preco", { ascending: true });
  else if (filtros.ordem === "maior-preco") query = query.order("preco", { ascending: false });
  else query = query.order("destaque", { ascending: false }).order("criado_em", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Produto[];
}

export async function buscarProduto(slug: string) {
  await connection();
  const sb = supabasePublico();
  const { data, error } = await sb
    .from("produtos")
    .select(CAMPOS_PRODUTO)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const produto = data as unknown as Produto;

  const { data: links } = await sb
    .from("produto_colecoes")
    .select("colecao:colecoes(nome, slug, ativa)")
    .eq("produto_id", produto.id);

  const colecoes = ((links ?? []) as unknown as { colecao: Pick<Colecao, "nome" | "slug" | "ativa"> | null }[])
    .map((l) => l.colecao)
    .filter((c): c is Pick<Colecao, "nome" | "slug" | "ativa"> => !!c && c.ativa);

  return { produto, colecoes };
}

export async function produtosRelacionados(produto: Produto, limite = 4) {
  await connection();
  let query = supabasePublico()
    .from("produtos")
    .select(CAMPOS_PRODUTO)
    .neq("id", produto.id)
    .eq("disponivel", true)
    .limit(limite)
    .order("destaque", { ascending: false })
    .order("criado_em", { ascending: false });
  if (produto.categoria_id) query = query.eq("categoria_id", produto.categoria_id);
  const { data } = await query;
  return (data ?? []) as unknown as Produto[];
}
