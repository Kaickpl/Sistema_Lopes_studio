import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";

export default function LayoutLoja({ children }: LayoutProps<"/">) {
  return (
    <>
      <Cabecalho />
      <main>{children}</main>
      <Rodape />
    </>
  );
}
