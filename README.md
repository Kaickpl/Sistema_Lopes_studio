# Catálogo 3D — guia de instalação

Site de catálogo para a sua loja de impressão 3D:

- **Página inicial** com todos os produtos, busca, filtro por categoria e ordenação por preço.
- **Coleções especiais** (Natal, Ano Novo, Carnaval...) com página própria.
- **Página do produto** com galeria de fotos, preço, descrição e o botão **"Falar com o vendedor"**, que abre o WhatsApp com a mensagem pronta sobre aquele produto.
- **Painel do dono** em `/admin` (protegido por e-mail e senha) para cadastrar produtos, fotos, categorias e coleções.

Tecnologias: **Next.js 16** (React + TypeScript), **Tailwind CSS** e **Supabase** (banco de dados, fotos e login, plano grátis).

---

## Passo 1 — Instalar o Node.js

O Next.js roda em cima do **Node.js**, então é ele que você instala no computador.

1. Acesse **https://nodejs.org** e baixe a versão **LTS** (o botão verde da esquerda).
2. Instale normalmente (Avançar, Avançar, Concluir). No Windows, deixe marcada a opção que adiciona ao PATH.
3. Abra um terminal (no Windows: **PowerShell** ou **Prompt de Comando**; no Mac: **Terminal**) e confira:

   ```bash
   node -v
   npm -v
   ```

   Se aparecerem dois números de versão (ex.: `v22.x.x` e `10.x.x`), deu certo. O Next.js 16 precisa do Node **20.9 ou mais novo**.

> **Recomendado:** instale também o **VS Code** (https://code.visualstudio.com) para abrir e editar o projeto.

## Passo 2 — Instalar o Next.js (e o resto) no projeto

O Next.js não é instalado "no computador": ele é uma dependência que fica dentro da pasta do projeto. Este projeto já vem configurado, então basta um comando.

1. Descompacte o arquivo `catalogo-3d.zip` em uma pasta (ex.: `Documentos/catalogo-3d`).
2. Abra o terminal **dentro dessa pasta**. No VS Code: *File > Open Folder*, escolha a pasta e depois *Terminal > New Terminal*.
3. Rode:

   ```bash
   npm install
   ```

   Isso baixa o Next.js, o React, o Supabase e tudo o que o site usa (cria a pasta `node_modules`). Demora 1 ou 2 minutos.

> **Curiosidade:** para criar um projeto Next.js do zero, o comando é `npx create-next-app@latest nome-do-projeto`. Foi assim que este projeto começou; você não precisa rodar isso agora.

## Passo 3 — Criar o banco de dados no Supabase

1. Crie uma conta grátis em **https://supabase.com** (pode entrar com o GitHub).
2. Clique em **New project**:
   - **Name:** `catalogo-3d` (ou o nome da loja)
   - **Database Password:** crie uma senha forte e guarde
   - **Region:** **South America (São Paulo)**, que é a mais rápida para o Brasil
3. Espere uns 2 minutos até o projeto ficar pronto.

### 3.1 — Criar as tabelas

1. No menu da esquerda, abra o **SQL Editor** e clique em **New query**.
2. Abra o arquivo **`supabase/schema.sql`** deste projeto, copie **tudo** e cole no editor.
3. Clique em **Run**. Deve aparecer *"Success. No rows returned"*.

Isso cria as tabelas (produtos, categorias, coleções), as regras de segurança, o espaço para as fotos e quatro categorias iniciais.

### 3.2 — Criar o seu usuário de administrador

1. No menu da esquerda, vá em **Authentication > Users**.
2. Clique em **Add user > Create new user**.
3. Coloque seu e-mail e uma senha, e **marque "Auto Confirm User"**.
4. Volte ao **SQL Editor**, abra uma nova query e rode (trocando pelo **seu** e-mail):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'seu-email@exemplo.com';
   ```

### 3.3 — Bloquear novos cadastros (recomendado)

Em **Authentication > Sign In / Providers**, desligue **"Allow new users to sign up"**. Assim ninguém consegue criar conta no seu projeto. Mesmo que alguém consiga, só quem está na tabela `admins` pode alterar o catálogo.

### 3.4 — Pegar as chaves do projeto

Clique no botão **Connect** no topo do painel do Supabase (ou vá em **Project Settings > API Keys**) e copie:

- a **Project URL** (algo como `https://abcdefgh.supabase.co`)
- a chave **publishable** (começa com `sb_publishable_...`) **ou** a chave **anon** (legacy). Qualquer uma das duas funciona.

> ⚠️ **Nunca** use a chave `secret` / `service_role` no site. Ela dá acesso total ao banco.

## Passo 4 — Configurar o site

1. Na pasta do projeto, faça uma cópia do arquivo **`.env.example`** e renomeie a cópia para **`.env.local`**.
2. Abra o `.env.local` e preencha:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxx

   # DDI 55 + DDD + número, só números
   NEXT_PUBLIC_WHATSAPP=5581999999999

   NEXT_PUBLIC_LOJA_NOME=Nome da Sua Loja
   NEXT_PUBLIC_INSTAGRAM=seu_instagram
   ```

## Passo 5 — Rodar no seu computador

```bash
npm run dev
```

Abra no navegador:

- **Catálogo:** http://localhost:3000
- **Painel do dono:** http://localhost:3000/admin

Para parar o servidor, aperte `Ctrl + C` no terminal. Sempre que mudar o `.env.local`, pare e rode `npm run dev` de novo.

## Passo 6 — Usar o painel

1. Entre em `/admin` com o e-mail e a senha do passo 3.2.
2. **Categorias:** renomeie, reordene ou crie novas (ex.: Chaveiros). Elas viram os filtros do catálogo.
3. **Coleções:** crie "Especial de Natal", por exemplo, com uma foto de capa opcional. Quando a data passar, clique em **Ocultar**.
4. **Produtos > + Novo produto:** envie as fotos (a primeira é a capa), preencha nome, preço, descrição e categoria, e marque as coleções.
   - **Disponível** desligado: aparece como **Esgotado** e o botão vira **"Pedir sob encomenda"**.
   - **Destaque**: o produto aparece primeiro, com selo.
   - Na lista de produtos, clicar em **Disponível/Esgotado** troca na hora.

As fotos do celular são reduzidas automaticamente antes do envio, então pode mandar direto da galeria.

## Passo 7 — Colocar o site no ar (de graça)

> **Importante:** o plano grátis da **Vercel** só permite uso **não comercial**, e um catálogo de vendas conta como comercial. Por isso o passo a passo abaixo usa a **Netlify**, que tem plano grátis e suporta Next.js 16. Se um dia quiser usar a Vercel, vai precisar do plano Pro.

### 7.1 — Subir o código para o GitHub

1. Crie uma conta em **https://github.com** e um repositório novo (pode ser **privado**), ex.: `catalogo-3d`.
2. Na pasta do projeto, rode (trocando `SEU-USUARIO`):

   ```bash
   git init
   git add .
   git commit -m "Primeira versão do catálogo"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/catalogo-3d.git
   git push -u origin main
   ```

   O arquivo `.env.local` **não** é enviado (está no `.gitignore`), o que é o certo: as chaves ficam só no seu computador e na hospedagem.

### 7.2 — Publicar na Netlify

1. Crie uma conta em **https://netlify.com** entrando com o GitHub.
2. **Add new project > Import an existing project > GitHub** e escolha o repositório `catalogo-3d`.
3. A Netlify detecta o Next.js sozinha. Antes de publicar, abra **Environment variables** e adicione as **mesmas 5 variáveis** do seu `.env.local`.
4. Clique em **Deploy**. Em poucos minutos você recebe um link como `https://catalogo-3d.netlify.app`.
5. Coloque esse link na **bio do Instagram**.

Depois disso, toda vez que você fizer `git push`, o site se atualiza sozinho. **Produtos novos não precisam de push**: o que você cadastra no painel aparece no site na hora.

> Quer um domínio próprio (ex.: `sualoja.com.br`)? Registre no **registro.br** e configure em *Domain management* na Netlify.

---

## Personalizar

| O que mudar | Onde |
|---|---|
| Cores | `src/app/globals.css` (variáveis no topo: `--filamento` é o laranja) |
| Textos da página inicial | `src/app/(loja)/page.tsx` |
| Mensagem que vai para o WhatsApp | `src/lib/utils.ts` (função `mensagemProduto`) |
| Rodapé | `src/components/Rodape.tsx` |

## Estrutura do projeto

```
supabase/schema.sql          → banco de dados (rodar uma vez no Supabase)
src/app/(loja)/              → páginas públicas: início, produto, coleção
src/app/admin/               → painel do dono (login, produtos, categorias, coleções)
src/components/              → peças reutilizáveis (cartão de produto, galeria, botões)
src/lib/data.ts              → leituras do banco usadas pelo catálogo
src/proxy.ts                 → protege o /admin (exige login)
```

## Problemas comuns

- **"Sem permissão" ao salvar no painel:** faltou o comando do passo 3.2 (inserir seu usuário em `admins`), ou ele foi rodado com outro e-mail.
- **"E-mail não confirmado" no login:** recrie o usuário marcando **Auto Confirm User**.
- **O site abre, mas sem produtos e com erro:** confira a URL e a chave no `.env.local` (ou nas variáveis da Netlify) e se o `schema.sql` foi executado.
- **Mudei o `.env.local` e nada aconteceu:** pare o `npm run dev` (Ctrl + C) e rode de novo.
- **Projeto do Supabase "pausado":** no plano grátis, projetos sem nenhum acesso por cerca de uma semana são pausados. É só entrar no painel do Supabase e clicar em **Restore**.
