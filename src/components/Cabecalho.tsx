import Link from "next/link";
import { LOJA } from "@/lib/config";
import { linkWhatsApp } from "@/lib/utils";
import { IconeCubo, IconeInstagram, IconeWhatsApp } from "./Icones";

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-30 border-b border-linha bg-papel/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-tinta text-papel">
            <IconeCubo className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">{LOJA.nome}</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#catalogo"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-tinta-suave hover:text-tinta sm:block"
          >
            Catálogo
          </Link>
          {LOJA.instagram && (
            <a
              href={`https://instagram.com/${LOJA.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-10 place-items-center rounded-full text-tinta-suave hover:bg-papel-2 hover:text-tinta"
              aria-label="Instagram"
            >
              <IconeInstagram />
            </a>
          )}
          <a
            href={linkWhatsApp("Olá! Vim pelo catálogo e queria tirar uma dúvida.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-zap px-4 py-2 text-sm font-semibold text-white hover:bg-zap-escuro"
          >
            <IconeWhatsApp className="size-4" />
            <span className="hidden sm:inline">Fale comigo</span>
            <span className="sm:hidden">Contato</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
