import { Suspense } from 'react';
import type { Metadata } from 'next';
import { INITIAL_PRODUCTS } from '@/lib/constants';
import { ProductDetailClient } from './ProductDetailClient';

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Barang Tidak Ditemukan | SNEERING',
    };
  }

  return {
    title: `${product.title} | SNEERING CATALOG`,
    description: product.description.slice(0, 150) + '...',
    openGraph: {
      title: `${product.title} - SNEERING`,
      description: `${product.condition} • Rp ${product.price.toLocaleString('id-ID')} • Hubungi langsung via WhatsApp`,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-zinc-400">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <p className="mt-3 text-xs">Memuat detail barang...</p>
        </div>
      }
    >
      <ProductDetailClient slug={slug} />
    </Suspense>
  );
}
