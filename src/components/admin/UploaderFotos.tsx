"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { enviarFoto } from "@/lib/imagem";
import { mensagemErro } from "./ui";

type Props = {
  fotos: string[];
  aoMudar: (fotos: string[]) => void;
  pasta?: "produtos" | "colecoes";
  maximo?: number;
};

/** Envio de várias fotos. A primeira foto é a capa do produto. */
export function UploaderFotos({ fotos, aoMudar, pasta = "produtos", maximo = 10 }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(0);
  const [erro, setErro] = useState("");

  async function adicionar(arquivos: FileList | null) {
    if (!arquivos?.length) return;
    setErro("");
    const lista = Array.from(arquivos).slice(0, Math.max(0, maximo - fotos.length));
    setEnviando(lista.length);
    const novas: string[] = [];
    for (const arq of lista) {
      try {
        novas.push(await enviarFoto(arq, pasta));
      } catch (e) {
        setErro(mensagemErro(e));
      }
      setEnviando((n) => n - 1);
    }
    aoMudar([...fotos, ...novas]);
    if (input.current) input.current.value = "";
  }

  function mover(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= fotos.length) return;
    const copia = [...fotos];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    aoMudar(copia);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {fotos.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-linha bg-papel-2">
            <Image src={url} alt={`Foto ${i + 1}`} fill sizes="160px" className="object-cover" />
            {i === 0 && maximo > 1 && (
              <span className="absolute left-1.5 top-1.5 rounded-md bg-filamento px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                Capa
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent p-1.5">
              <div className="flex gap-1">
                {maximo > 1 && (
                  <>
                    <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Mover para a esquerda" className="grid size-7 place-items-center rounded-md bg-white/90 text-sm disabled:opacity-30">‹</button>
                    <button type="button" onClick={() => mover(i, 1)} disabled={i === fotos.length - 1} aria-label="Mover para a direita" className="grid size-7 place-items-center rounded-md bg-white/90 text-sm disabled:opacity-30">›</button>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => aoMudar(fotos.filter((f) => f !== url))}
                aria-label="Remover foto"
                className="grid size-7 place-items-center rounded-md bg-white/90 text-sm text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {Array.from({ length: enviando }).map((_, i) => (
          <div key={`env-${i}`} className="grid aspect-square animate-pulse place-items-center rounded-xl bg-papel-2 text-xs text-tinta-suave">
            Enviando...
          </div>
        ))}

        {fotos.length + enviando < maximo && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-linha text-tinta-suave transition hover:border-filamento hover:text-filamento"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-xs font-semibold">{maximo > 1 ? "Adicionar fotos" : "Escolher foto"}</span>
          </button>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={maximo > 1}
        className="hidden"
        onChange={(e) => adicionar(e.target.files)}
      />
      {erro && <p className="text-sm text-red-700">{erro}</p>}
    </div>
  );
}
