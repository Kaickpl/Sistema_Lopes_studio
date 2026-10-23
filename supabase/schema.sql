-- =====================================================================
--  CATÁLOGO 3D — estrutura do banco de dados
--  Cole TODO este arquivo no Supabase: SQL Editor > New query > Run
--  (pode rodar de novo sem problema: ele não apaga dados)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) TABELAS
-- ---------------------------------------------------------------------

-- Categorias: Marca-páginas, Suportes, Brinquedos...
create table if not exists public.categorias (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  slug       text not null unique,
  ordem      int  not null default 0,
  criado_em  timestamptz not null default now()
);

-- Coleções: Especial de Natal, Ano Novo, Carnaval...
create table if not exists public.colecoes (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  slug       text not null unique,
  descricao  text,
  capa_url   text,
  ativa      boolean not null default true,   -- se false, some do site
  ordem      int  not null default 0,
  criado_em  timestamptz not null default now()
);

-- Produtos prontos para venda
create table if not exists public.produtos (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  slug          text not null unique,
  descricao     text,
  preco         numeric(10,2) not null default 0,
  fotos         text[] not null default '{}',   -- a primeira é a capa
  categoria_id  uuid references public.categorias(id) on delete set null,
  disponivel    boolean not null default true,   -- false = "Esgotado"
  destaque      boolean not null default false,  -- aparece primeiro
  criado_em     timestamptz not null default now()
);

-- Um produto pode estar em várias coleções
create table if not exists public.produto_colecoes (
  produto_id  uuid not null references public.produtos(id) on delete cascade,
  colecao_id  uuid not null references public.colecoes(id) on delete cascade,
  primary key (produto_id, colecao_id)
);

-- Quem pode mexer no catálogo (só você)
create table if not exists public.admins (
  user_id  uuid primary key references auth.users(id) on delete cascade
);

create index if not exists produtos_categoria_idx on public.produtos(categoria_id);
create index if not exists produto_colecoes_colecao_idx on public.produto_colecoes(colecao_id);

-- ---------------------------------------------------------------------
-- 2) FUNÇÃO "é administrador?"
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3) SEGURANÇA (Row Level Security)
--    Visitantes só LEEM. Só administradores criam/editam/apagam.
-- ---------------------------------------------------------------------
alter table public.categorias       enable row level security;
alter table public.colecoes         enable row level security;
alter table public.produtos         enable row level security;
alter table public.produto_colecoes enable row level security;
alter table public.admins           enable row level security;

grant select on public.categorias, public.colecoes, public.produtos, public.produto_colecoes
  to anon, authenticated;
grant insert, update, delete on public.categorias, public.colecoes, public.produtos, public.produto_colecoes
  to authenticated;
grant select on public.admins to authenticated;

-- Leitura pública
drop policy if exists "leitura publica" on public.categorias;
create policy "leitura publica" on public.categorias for select using (true);

drop policy if exists "leitura publica" on public.colecoes;
create policy "leitura publica" on public.colecoes for select using (ativa or public.is_admin());

drop policy if exists "leitura publica" on public.produtos;
create policy "leitura publica" on public.produtos for select using (true);

drop policy if exists "leitura publica" on public.produto_colecoes;
create policy "leitura publica" on public.produto_colecoes for select using (true);

-- Escrita só para admin
drop policy if exists "admin escreve" on public.categorias;
create policy "admin escreve" on public.categorias for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin escreve" on public.colecoes;
create policy "admin escreve" on public.colecoes for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin escreve" on public.produtos;
create policy "admin escreve" on public.produtos for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin escreve" on public.produto_colecoes;
create policy "admin escreve" on public.produto_colecoes for all
  using (public.is_admin()) with check (public.is_admin());

-- Cada usuário só vê a própria linha na tabela de admins
drop policy if exists "ve a si mesmo" on public.admins;
create policy "ve a si mesmo" on public.admins for select using (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 4) FOTOS (Storage)
--    Bucket público "fotos": qualquer um vê, só admin envia/apaga.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do update set public = true;

drop policy if exists "admin envia fotos" on storage.objects;
create policy "admin envia fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and public.is_admin());

drop policy if exists "admin edita fotos" on storage.objects;
create policy "admin edita fotos" on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and public.is_admin());

drop policy if exists "admin apaga fotos" on storage.objects;
create policy "admin apaga fotos" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and public.is_admin());

-- ---------------------------------------------------------------------
-- 5) CATEGORIAS INICIAIS (pode editar depois pelo painel)
-- ---------------------------------------------------------------------
insert into public.categorias (nome, slug, ordem) values
  ('Marca-páginas', 'marca-paginas', 1),
  ('Suportes',      'suportes',      2),
  ('Brinquedos',    'brinquedos',    3),
  ('Decoração',     'decoracao',     4)
on conflict (slug) do nothing;

-- =====================================================================
--  DEPOIS DE CRIAR SEU USUÁRIO (Authentication > Users > Add user),
--  rode a linha abaixo trocando pelo SEU e-mail para virar administrador:
--
--  insert into public.admins (user_id)
--  select id from auth.users where email = 'seu-email@exemplo.com';
-- =====================================================================
