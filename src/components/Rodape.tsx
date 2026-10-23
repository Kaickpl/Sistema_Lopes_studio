import { LOJA } from "@/lib/config";
import { linkWhatsApp } from "@/lib/utils";
import { IconeInstagram, IconeWhatsApp } from "./Icones";
import { MarcaLS } from "./Logo";

export function Rodape() {
  return (
    <footer className="mt-24 bg-tinta text-papel">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <MarcaLS className="h-16 w-auto" />
            <p className="mt-5 font-display text-2xl font-black uppercase leading-none tracking-tight sm:text-3xl">
              {LOJA.nome}
            </p>
            <p className="mt-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.42em] text-papel/75">
              <span className="h-0.5 w-8 bg-papel" aria-hidden />
              Impressões 3D
              <span className="h-0.5 w-8 bg-filamento" aria-hidden />
            </p>
            <p className="mt-6 max-w-sm text-sm text-papel/70">
              Peças impressas em 3D. Não achou o que procura? Também fazemos sob encomenda.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <a
              href={linkWhatsApp("Olá! Gostaria de fazer uma encomenda personalizada.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-papel px-5 py-3 text-xs font-bold uppercase tracking-wider text-tinta transition hover:bg-filamento-escuro hover:text-white"
            >
              <IconeWhatsApp className="size-4" /> Fazer uma encomenda
            </a>
            {LOJA.instagram && (
              <a
                href={`https://instagram.com/${LOJA.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-papel/75 hover:text-papel"
              >
                <IconeInstagram className="size-4" /> @{LOJA.instagram}
              </a>
            )}
          </div>
        </div>

        <p className="mt-10 border-t border-papel/15 pt-6 text-xs text-papel/55">© {LOJA.nome}</p>
      </div>
    </footer>
  );
}
