// Configurações da loja (vêm do arquivo .env.local)

/** "lopesstudio.com.br/" -> "https://lopesstudio.com.br" */
function enderecoSite(valor: string) {
  const limpo = valor.trim().replace(/\/+$/, "");
  if (!limpo) return "";
  return /^https?:\/\//.test(limpo) ? limpo : `https://${limpo}`;
}

export const LOJA = {
  nome: process.env.NEXT_PUBLIC_LOJA_NOME || "Lopes Studio",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(/\D/g, ""),
  instagram: (process.env.NEXT_PUBLIC_INSTAGRAM || "").replace(/^@/, ""),
  // Endereço oficial do site. Vazio = a mensagem do WhatsApp vai sem link
  site: enderecoSite(process.env.NEXT_PUBLIC_SITE_URL || ""),
};

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const BUCKET_FOTOS = "fotos";
