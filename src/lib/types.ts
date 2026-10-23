export type Categoria = {
  id: string;
  nome: string;
  slug: string;
  ordem: number;
};

export type Colecao = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  capa_url: string | null;
  ativa: boolean;
  ordem: number;
};

export type Produto = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  preco: number;
  fotos: string[];
  categoria_id: string | null;
  disponivel: boolean;
  destaque: boolean;
  criado_em: string;
  categoria?: Pick<Categoria, "nome" | "slug"> | null;
};
