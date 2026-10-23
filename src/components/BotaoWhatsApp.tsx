import { linkWhatsApp, mensagemProduto } from "@/lib/utils";
import { IconeWhatsApp } from "./Icones";

type Props = {
  produto: { nome: string; slug: string; preco: number; disponivel: boolean };
};

/**
 * Botão "Falar com o vendedor": abre o WhatsApp com a mensagem
 * sobre o produto já escrita (nome, preço e, se configurado, o link oficial do produto).
 */
export function BotaoWhatsApp({ produto }: Props) {
  return (
    <a
      href={linkWhatsApp(mensagemProduto(produto))}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2.5 rounded-md bg-tinta px-6 py-4 text-sm font-bold uppercase tracking-wider text-papel shadow-[0_10px_24px_-12px_rgba(23,23,27,0.6)] transition hover:bg-filamento-escuro hover:text-white active:scale-[0.99]"
    >
      <IconeWhatsApp className="size-5" />
      {produto.disponivel ? "Falar com o vendedor" : "Pedir sob encomenda"}
    </a>
  );
}
