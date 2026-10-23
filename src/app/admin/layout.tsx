import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false }, // o Google não mostra o painel
};

export default function LayoutAdmin({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-papel">{children}</div>;
}
