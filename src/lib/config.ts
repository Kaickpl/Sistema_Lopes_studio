// Configurações da loja (vêm do arquivo .env.local)

export const LOJA = {
  nome: process.env.NEXT_PUBLIC_LOJA_NOME || "Minha Loja 3D",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(/\D/g, ""),
  instagram: (process.env.NEXT_PUBLIC_INSTAGRAM || "").replace(/^@/, ""),
};

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const BUCKET_FOTOS = "fotos";
