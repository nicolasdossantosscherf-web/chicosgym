import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import { ProductDetail } from "@/components/product-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata(props: PageProps<"/loja/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const product = products.find((p) => p.id === id);
  if (!product) return {};
  return {
    title: `${product.title} — Loja Chico's Gym`,
    description: product.description,
  };
}

export default async function ProdutoPage(props: PageProps<"/loja/[id]">) {
  const { id } = await props.params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <main className="pt-28 md:pt-32">
      <ProductDetail key={product.id} product={product} />
    </main>
  );
}
