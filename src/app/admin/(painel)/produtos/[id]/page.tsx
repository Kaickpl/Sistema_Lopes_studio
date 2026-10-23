import { Suspense } from "react";
import { FormProduto } from "@/components/admin/FormProduto";

export default function EditarProduto({ params }: PageProps<"/admin/produtos/[id]">) {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-tinta-suave">Carregando...</p>}>
      <Formulario params={params} />
    </Suspense>
  );
}

async function Formulario({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FormProduto key={id} id={id} />;
}
