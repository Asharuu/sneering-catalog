'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageSquare,
  ShoppingBag,
  Share2,
  Check,
  ShieldCheck,
  Handshake,
  Info,
  Video,
  Package,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatRupiah } from '@/lib/whatsapp';
import { NEGO_RULES, STATUS_LABELS, INITIAL_PRODUCTS } from '@/lib/constants';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductDetailClientProps {
  slug: string;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ slug }) => {
  const { products, openNegoModal, addToCart, cart } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeProducts = mounted ? products : INITIAL_PRODUCTS;
  const product = activeProducts.find((p) => p.slug === slug);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [mediaMode, setMediaMode] = useState<'image' | 'video'>('image');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product?.video && (!product.images || product.images.length === 0 || product.images[0].trim() === '')) {
      setMediaMode('video');
    } else {
      setMediaMode('image');
    }
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-zinc-300">
        <h2 className="text-xl font-bold text-white">Barang Tidak Ditemukan</h2>
        <p className="mt-2 text-xs text-zinc-400">
          Barang yang kamu cari mungkin sudah dihapus atau slug URL tidak sesuai.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>
    );
  }

  const isReady = product.status === 'ready';
  const isSold = product.status === 'sold';
  const isBooked = product.status === 'booked';

  const statusMeta = STATUS_LABELS[product.status];
  const negoMeta = NEGO_RULES.find((r) => r.value === product.negoRule);
  const inCart = cart.some((item) => item.product.id === product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const relatedProducts = activeProducts
    .filter((p) => p.id !== product.id && p.status === 'ready')
    .slice(0, 3);

  const hasVideo = Boolean(product.video);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Breadcrumb & Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Utama</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
          title="Salin Link Produk"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Tersalin!' : 'Bagikan Link'}</span>
        </button>
      </div>

      {/* Main Grid: Gallery & Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Multi-photo & Video Gallery (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Media */}
          <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
            {mediaMode === 'video' && product.video ? (
              <video
                src={product.video}
                controls
                playsInline
                autoPlay
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={
                  product.images[activeImgIndex] ||
                  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80'
                }
                alt={product.title}
                className={`h-full w-full object-cover transition-all duration-300 ${
                  isSold ? 'grayscale-40' : ''
                }`}
              />
            )}

            {/* Badges Overlay */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-2 z-10">
              <span
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold backdrop-blur-md ${statusMeta.bg} ${statusMeta.color}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isReady ? 'bg-emerald-400 animate-pulse' : isBooked ? 'bg-amber-400' : 'bg-zinc-400'
                  }`}
                />
                {statusMeta.label}
              </span>
              <span className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 px-3 py-1 text-xs font-semibold text-zinc-200 backdrop-blur-md">
                {product.condition}
              </span>

              {product.stock !== undefined && (
                <span className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
                  {product.stock > 0 ? `Stok: ${product.stock} pcs` : 'Stok Habis'}
                </span>
              )}
            </div>

            <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
              {negoMeta && (
                <span
                  className={`rounded-xl border px-3 py-1 text-xs font-bold backdrop-blur-md ${negoMeta.badgeColor}`}
                >
                  {negoMeta.label}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails Row (Images + Video Preview Button) */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setMediaMode('image');
                  setActiveImgIndex(idx);
                }}
                className={`relative aspect-4/3 w-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border transition-all cursor-pointer ${
                  mediaMode === 'image' && activeImgIndex === idx
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-zinc-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.title} view ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}

            {hasVideo && (
              <button
                type="button"
                onClick={() => setMediaMode('video')}
                className={`relative aspect-4/3 w-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  mediaMode === 'video'
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-950/40 text-indigo-300'
                    : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white'
                }`}
              >
                <Video className="w-6 h-6 mb-1 text-indigo-400" />
                <span className="text-[10px] font-bold">Video Fisik</span>
              </button>
            )}
          </div>

          {/* Guarantee Box */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Jaminan Transparansi Kondisi Barang
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Foto dan video di atas adalah kondisi fisik asli barang. Jika kamu ingin meminta video sudut tertentu atau cek fungsi barang, kamu bisa langsung minta lewat WhatsApp ke penjual secara leluasa.
            </p>
          </div>
        </div>

        {/* Right Column: Pricing, Specs, and Actions (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & Category */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Price Box */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-lg space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-zinc-400 line-through font-mono">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="rounded-lg bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/20">
                  Hemat {discountPercent}%
                </span>
              )}
            </div>

            {/* Nego Explainer Banner */}
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <Handshake className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <span className="font-bold">{negoMeta?.label}:</span> Semua harga bisa dinego santai langsung chat via WhatsApp tanpa perantara.
              </div>
            </div>

            {/* Stock Breakdown Banner */}
            {product.stockBreakdown && (
              <div className="flex items-start gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-xs text-zinc-300">
                <Package className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <span className="font-semibold text-white">Informasi Stok:</span>{' '}
                  <span className="text-zinc-300">{product.stockBreakdown}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => openNegoModal(product)}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-bold transition-all shadow-lg cursor-pointer ${
                  isSold
                    ? 'border border-zinc-800 bg-zinc-800/50 text-zinc-400 hover:text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20 active:scale-98'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {isSold
                    ? 'Tanya Ketersediaan Serupa ke Penjual'
                    : 'Beli / Ajukan Nego via WhatsApp'}
                </span>
              </button>

              {isReady && (
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  disabled={inCart}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold border transition-all cursor-pointer ${
                    inCart
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-default'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>
                    {inCart ? 'Sudah Ada di Keranjang Borongan' : '+ Tambah ke Keranjang Borongan'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Condition & Notes Section */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              Detail Kondisi Fisik & Fungsi
            </h3>
            <div className="text-xs text-zinc-300 leading-relaxed">
              <div className="font-semibold text-white mb-1">
                Kondisi: <span className="text-emerald-400">{product.condition}</span>
              </div>
              {product.conditionNotes ? (
                <p className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-zinc-300">
                  {product.conditionNotes}
                </p>
              ) : (
                <p className="text-zinc-400">Kondisi barang baru terawat.</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Deskripsi Barang
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Spesifikasi & Informasi Detail
              </h3>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 divide-y divide-zinc-800/80 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex py-2.5 px-3.5">
                    <span className="w-1/3 text-zinc-400 font-medium">{key}</span>
                    <span className="w-2/3 text-white font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 sm:mt-24 border-t border-zinc-800/80 pt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Barang Lain yang Masih Ready</h3>
              <p className="text-xs text-zinc-400">Merchandise Mobile Legends lainnya yang siap kamu miliki</p>
            </div>
            <Link
              href="/"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
