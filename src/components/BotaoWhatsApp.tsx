"use client";

import { linkWhatsApp, mensagemProduto } from "@/lib/utils";
import { IconeWhatsApp } from "./Icones";

type Props = {
  produto: { nome: string; preco: number; disponivel: boolean };
};

/**
 * Botão "Falar com o vendedor": abre o WhatsApp com a mensagem
 * sobre o produto já escrita (inclui o link da página do produto).
 */
export function BotaoWhatsApp({ produto }: Props) {
  return (
    <a
      href={linkWhatsApp(mensagemProduto(produto))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        // No clique, acrescenta o endereço da página na mensagem
        e.currentTarget.href = linkWhatsApp(mensagemProduto(produto, window.location.href));
      }}
      className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-zap px-6 py-4 text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgba(31,168,85,0.6)] transition hover:bg-zap-escuro active:scale-[0.99]"
    >
      <IconeWhatsApp className="size-5" />
      {produto.disponivel ? "Falar com o vendedor" : "Pedir sob encomenda"}
    </a>
  );
}
