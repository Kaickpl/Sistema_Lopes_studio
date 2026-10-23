"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Aviso, Campo, estilos } from "@/components/admin/ui";
import { IconeCubo } from "@/components/Icones";
import { supabaseNavegador } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    const { error } = await supabaseNavegador().auth.signInWithPassword({ email, password: senha });
    setEnviando(false);
    if (error) {
      setErro(
        /invalid login/i.test(error.message)
          ? "E-mail ou senha incorretos."
          : /email not confirmed/i.test(error.message)
            ? "E-mail não confirmado. No Supabase, crie o usuário marcando 'Auto Confirm User'."
            : error.message,
      );
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <form onSubmit={entrar} className={`${estilos.cartao} w-full max-w-sm p-6 sm:p-8`}>
        <span className="grid size-11 place-items-center rounded-xl bg-tinta text-papel">
          <IconeCubo className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Painel da loja</h1>
        <p className="mt-1 text-sm text-tinta-suave">Entre para gerenciar o catálogo.</p>

        <div className="mt-6 flex flex-col gap-4">
          <Campo rotulo="E-mail">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={estilos.input}
            />
          </Campo>
          <Campo rotulo="Senha">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={estilos.input}
            />
          </Campo>
          {erro && <Aviso tipo="erro">{erro}</Aviso>}
          <button type="submit" disabled={enviando} className={`${estilos.botao} mt-2 py-3`}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
