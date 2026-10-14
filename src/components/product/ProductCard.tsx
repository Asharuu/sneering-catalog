'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageSquare, ChevronRight, Eye, Video } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/whatsapp';
import { NEGO_RULES, STATUS_LABELS } from '@/lib/constants';
import { useAppStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openNegoModal, addToCart, cart } = useAppStore();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSold = product.status === 'sold';
  const isBooked = product.status === 'booked';
  const isReady = product.status === 'ready';

  const statusMeta = STATUS_LABELS[product.status];
  const negoMeta = NEGO_RULES.find((r) => r.value === product.negoRule);
  const inCart = mounted ? cart.some((item) => item.product.id === product.id) : false;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const hasVideo = Boolean(product.video);
  const hasImages = product.images && product.images.length > 0 && product.images[0].trim() !== '';

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-zinc-900/90 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 ${
        isSold
          ? 'border-zinc-800/50 opacity-75'
          : 'border-zinc-800 hover:border-zinc-700/80 hover:-translate-y-1'
      }`}
    >
      {/* Media Showcase (Video or Image) */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-950">
        {!hasImages && hasVideo ? (
          <video
            src={product.video}
            controls
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={
              product.images[currentImgIndex] ||
              'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
            }
            alt={product.title}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isSold ? 'grayscale-50' : ''
            }`}
            loading="lazy"
          />
        )}

        {/* Status & Condition Badges Overlay */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 z-10">
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-semibold backdrop-blur-md ${statusMeta.bg} ${statusMeta.color}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isReady ? 'bg-emerald-400 animate-pulse' : isBooked ? 'bg-amber-400' : 'bg-zinc-400'
              }`}
            />
            {statusMeta.label}
          </span>

          {product.stock !== undefined && (
            <span
              className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold backdrop-blur-md ${
                product.stock > 0
                  ? 'border-zinc-800/80 bg-zinc-950/80 text-emerald-300'
                  : 'border-rose-900/80 bg-rose-950/80 text-rose-300'
              }`}
            >
              {product.stock > 0 ? `Stok: ${product.stock} pcs` : 'Stok Habis'}
            </span>
          )}

          {hasVideo && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 backdrop-blur-md">
              <Video className="w-3 h-3 text-indigo-400" />
              <span>Ada Video</span>
            </span>
          )}
        </div>

        {/* Nego Badge Overlay */}
        <div className="absolute right-2.5 top-2.5 z-10 flex flex-col items-end gap-1">
          {negoMeta && (
            <span
              className={`rounded-lg border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md ${negoMeta.badgeColor}`}
            >
              {negoMeta.label}
            </span>
          )}
        </div>

        {/* Image Indicator Dots (if multiple images) */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImgIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentImgIndex === idx
                    ? 'w-4 bg-emerald-400'
                    : 'w-1.5 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Lihat foto ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Quick Link Overlay */}
        <Link
          href={`/p/${product.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`Lihat detail ${product.title}`}
        />
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-1 text-[11px] font-medium text-emerald-400/90 tracking-wide flex items-center justify-between">
          <span>{product.category}</span>
          {product.stockBreakdown && (
            <span className="text-[10px] text-zinc-400 truncate max-w-[170px]" title={product.stockBreakdown}>
              {product.stockBreakdown}
            </span>
          )}
        </div>

        <Link
          href={`/p/${product.slug}`}
          className="group-hover:text-emerald-400 transition-colors"
        >
          <h3 className="line-clamp-2 text-sm font-bold text-white leading-snug">
            {product.title}
          </h3>
        </Link>

        {product.conditionNotes && (
          <p className="mt-1.5 line-clamp-1 text-[11px] text-zinc-400">
            <span className="text-zinc-400 font-medium">Catatan:</span> {product.conditionNotes}
          </p>
        )}

        {/* Price Section */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-extrabold text-white font-mono">
            {formatRupiah(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-zinc-400 line-through font-mono">
              {formatRupiah(product.originalPrice)}
            </span>
          )}
          {discountPercent && (
            <span className="rounded bg-rose-500/10 px-1 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action Button Row */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2">
          {/* Main WhatsApp Nego/Buy Button */}
          <button
            type="button"
            onClick={() => openNegoModal(product)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all shadow-sm ${
              isSold
                ? 'border border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:text-white'
                : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-emerald-500/10 active:scale-98 cursor-pointer'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isSold ? 'Tanya Serupa' : 'Beli / Nego via WA'}</span>
          </button>

          {/* Add to Cart Button (if ready) */}
          {isReady && (
            <button
              type="button"
              onClick={() => addToCart(product)}
              disabled={inCart}
              className={`flex items-center justify-center h-8.5 w-8.5 rounded-xl border transition-all ${
                inCart
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 cursor-default'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700 hover:text-white hover:bg-zinc-800 cursor-pointer'
              }`}
              title={inCart ? 'Sudah di keranjang' : 'Tambah ke keranjang borongan'}
              aria-label="Tambah ke Keranjang"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}

          {/* View Details Icon */}
          <Link
            href={`/p/${product.slug}`}
            className="flex items-center justify-center h-8.5 w-8.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            title="Lihat Detail Produk"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
