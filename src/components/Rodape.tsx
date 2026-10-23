import { LOJA } from "@/lib/config";
import { linkWhatsApp } from "@/lib/utils";

export function Rodape() {
  return (
    <footer className="mt-24 border-t border-linha">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xl font-bold">{LOJA.nome}</p>
          <p className="mt-1 max-w-sm text-sm text-tinta-suave">
            Peças impressas em 3D. Não achou o que procura? Também fazemos sob encomenda.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a
            href={linkWhatsApp("Olá! Gostaria de fazer uma encomenda personalizada.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-filamento hover:underline"
          >
            Fazer uma encomenda
          </a>
          {LOJA.instagram && (
            <a
              href={`https://instagram.com/${LOJA.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tinta-suave hover:text-tinta"
            >
              @{LOJA.instagram}
            </a>
          )}
          <span className="text-tinta-suave">© {LOJA.nome}</span>
        </div>
      </div>
    </footer>
  );
}
