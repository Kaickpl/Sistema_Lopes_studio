import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import { LOJA } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: `${LOJA.nome} · Impressões 3D`,
    template: `%s · ${LOJA.nome}`,
  },
  description: `Catálogo de peças impressas em 3D prontas para venda — ${LOJA.nome}.`,
};

export const viewport: Viewport = {
  themeColor: "#f3f0e8", // creme da logo na barra do navegador do celular
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
