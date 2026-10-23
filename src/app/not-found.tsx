import Link from "next/link";
import { IconeCubo } from "@/components/Icones";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="camadas grid size-20 place-items-center rounded-3xl border border-linha bg-cartao text-tinta-suave">
        <IconeCubo className="size-10" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-tinta-suave">Esse produto pode ter sido removido ou o link está errado.</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-tinta px-6 py-3 text-sm font-semibold text-papel hover:bg-tinta/85"
      >
        Ver o catálogo
      </Link>
    </div>
  );
}
