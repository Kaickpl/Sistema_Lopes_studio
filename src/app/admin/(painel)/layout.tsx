import { PainelShell } from "@/components/admin/PainelShell";

export default function LayoutPainel({ children }: LayoutProps<"/admin">) {
  return <PainelShell>{children}</PainelShell>;
}
