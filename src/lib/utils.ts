import { LOJA } from "./config";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatarPreco(valor: number | string) {
  return BRL.format(Number(valor) || 0);
}

/** "Marca-página Dragão!" -> "marca-pagina-dragao" */
export function gerarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** "15,90" ou "15.90" ou "R$ 1.234,50" -> número */
export function lerPreco(texto: string) {
  const limpo = texto.replace(/[^\d,.-]/g, "");
  const normalizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo;
  const n = Number.parseFloat(normalizado);
  return Number.isFinite(n) ? n : 0;
}

/** Link do WhatsApp com a mensagem já escrita */
export function linkWhatsApp(mensagem: string) {
  const texto = encodeURIComponent(mensagem);
  return LOJA.whatsapp
    ? `https://wa.me/${LOJA.whatsapp}?text=${texto}`
    : `https://wa.me/?text=${texto}`;
}

export function mensagemProduto(
  produto: { nome: string; preco: number; disponivel: boolean },
  url?: string,
) {
  const linhas = produto.disponivel
    ? [
        `Olá! Tenho interesse no produto *${produto.nome}* (${formatarPreco(produto.preco)}).`,
        "Ainda está disponível?",
      ]
    : [
        `Olá! Vi o produto *${produto.nome}* no catálogo e ele está esgotado.`,
        "Vocês conseguem fazer um sob encomenda?",
      ];
  if (url) linhas.push("", url);
  return linhas.join("\n");
}
