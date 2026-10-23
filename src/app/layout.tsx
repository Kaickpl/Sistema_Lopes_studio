import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";
import { LOJA } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: `${LOJA.nome} · Impressões 3D`,
    template: `%s · ${LOJA.nome}`,
  },
  description: `Catálogo de peças impressas em 3D prontas para venda — ${LOJA.nome}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
