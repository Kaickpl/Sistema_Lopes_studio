"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { supabaseNavegador } from "@/lib/supabase/client";
import { IconeCubo } from "../Icones";

const LINKS = [
  { href: "/admin", rotulo: "Produtos" },
  { href: "/admin/categorias", rotulo: "Categorias" },
  { href: "/admin/colecoes", rotulo: "Coleções" },
];

function NavAdmin() {
  const pathname = usePathname();
  const ativo = (href: string) =>
    href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/produtos") : pathname.startsWith(href);
  return (
    <>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
            ativo(l.href) ? "bg-tinta text-papel" : "text-tinta-suave hover:bg-papel-2 hover:text-tinta"
          }`}
        >
          {l.rotulo}
        </Link>
      ))}
    </>
  );
}

export function PainelShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ehAdmin, setEhAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabaseNavegador()
      .rpc("is_admin")
      .then(({ data }: { data: boolean | null }) => setEhAdmin(!!data));
  }, []);

  async function sair() {
    await supabaseNavegador().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-linha bg-cartao/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-tinta text-papel">
              <IconeCubo className="size-4" />
            </span>
            <span className="font-display font-bold">Painel</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" target="_blank" className="rounded-lg px-3 py-2 font-medium text-tinta-suave hover:text-tinta">
              Ver site ↗
            </Link>
            <button onClick={sair} className="rounded-lg px-3 py-2 font-medium text-tinta-suave hover:text-tinta">
              Sair
            </button>
          </div>
        </div>
        <nav className="sem-barra mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          <Suspense
            fallback={LINKS.map((l) => (
              <span key={l.href} className="shrink-0 px-3.5 py-2 text-sm font-semibold text-tinta-suave">
                {l.rotulo}
              </span>
            ))}
          >
            <NavAdmin />
          </Suspense>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {ehAdmin === false && (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Sua conta ainda não é administradora.</strong> Você consegue ver o painel, mas não vai
            conseguir salvar nada. Rode no Supabase (SQL Editor) o comando do final do arquivo{" "}
            <code>supabase/schema.sql</code> com o seu e-mail.
          </div>
        )}
        {children}
      </div>
    </>
  );
}
