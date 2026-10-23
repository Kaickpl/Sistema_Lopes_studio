import Link from "next/link";
import { LOJA } from "@/lib/config";
import { linkWhatsApp } from "@/lib/utils";
import { IconeInstagram, IconeWhatsApp } from "./Icones";
import { Logo } from "./Logo";

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-30 border-b border-tinta/10 bg-papel/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" aria-label={`${LOJA.nome} — início`}>
          <Logo />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#catalogo"
            className="hidden px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-tinta-suave hover:text-tinta sm:block"
          >
            Catálogo
          </Link>
          {LOJA.instagram && (
            <a
              href={`https://instagram.com/${LOJA.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-9 place-items-center rounded-md text-tinta-suave hover:bg-papel-2 hover:text-tinta sm:size-10"
              aria-label="Instagram"
            >
              <IconeInstagram />
            </a>
          )}
          <a
            href={linkWhatsApp("Olá! Vim pelo catálogo e queria tirar uma dúvida.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md bg-tinta px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-papel transition hover:bg-filamento-escuro hover:text-white sm:px-4"
          >
            <IconeWhatsApp className="size-4" />
            <span className="hidden sm:inline">Fale comigo</span>
            <span className="max-[359px]:sr-only sm:hidden">Contato</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
