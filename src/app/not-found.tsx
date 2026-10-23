import Link from "next/link";
import { MarcaLS } from "@/components/Logo";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center px-4 text-center">
      <MarcaLS className="h-20 w-auto" />
      <h1 className="mt-8 font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
        Página não encontrada
      </h1>
      <p className="mt-3 text-tinta-suave">Esse produto pode ter sido removido ou o link está errado.</p>
      <Link
        href="/"
        className="mt-7 rounded-md bg-tinta px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-papel transition hover:bg-filamento-escuro hover:text-white"
      >
        Ver o catálogo
      </Link>
    </div>
  );
}
