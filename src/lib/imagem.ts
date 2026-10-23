"use client";

import { BUCKET_FOTOS } from "./config";
import { supabaseNavegador } from "./supabase/client";

const LADO_MAXIMO = 1600;

/**
 * Diminui a foto antes de enviar (fotos de celular têm 5–10 MB).
 * Resultado: WebP de até 1600px, normalmente 150–400 KB.
 */
async function redimensionar(arquivo: File): Promise<{ blob: Blob; ext: string; tipo: string }> {
  try {
    const bitmap = await createImageBitmap(arquivo, { imageOrientation: "from-image" });
    const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * escala);
    const h = Math.round(bitmap.height * escala);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/webp", 0.85));
    if (blob) return { blob, ext: "webp", tipo: "image/webp" };
  } catch {
    // se o navegador não conseguir converter, envia o arquivo original
  }
  const ext = arquivo.name.split(".").pop()?.toLowerCase() || "jpg";
  return { blob: arquivo, ext, tipo: arquivo.type || "image/jpeg" };
}

/** Envia uma foto para o Supabase Storage e devolve o link público. */
export async function enviarFoto(arquivo: File, pasta: "produtos" | "colecoes"): Promise<string> {
  const sb = supabaseNavegador();
  const { blob, ext, tipo } = await redimensionar(arquivo);
  const caminho = `${pasta}/${crypto.randomUUID()}.${ext}`;
  const { error } = await sb.storage.from(BUCKET_FOTOS).upload(caminho, blob, {
    contentType: tipo,
    cacheControl: "31536000",
  });
  if (error) throw new Error(`Falha ao enviar foto: ${error.message}`);
  return sb.storage.from(BUCKET_FOTOS).getPublicUrl(caminho).data.publicUrl;
}

/** Apaga fotos do Storage a partir dos links públicos (ignora links de fora). */
export async function apagarFotos(urls: string[]) {
  const marcador = `/object/public/${BUCKET_FOTOS}/`;
  const caminhos = urls
    .map((u) => (u.includes(marcador) ? decodeURIComponent(u.split(marcador)[1]) : null))
    .filter((c): c is string => !!c);
  if (caminhos.length === 0) return;
  await supabaseNavegador().storage.from(BUCKET_FOTOS).remove(caminhos);
}
