'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageSquare, Shield, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const { cart, toggleCart, settings } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSettings = mounted ? settings : DEFAULT_SETTINGS;
  const cartCount = mounted ? cart.length : 0;

  const waLink = `https://wa.me/${normalizeWhatsAppNumber(
    activeSettings.whatsappNumber
  )}?text=${encodeURIComponent(
    `Halo Admin ${activeSettings.storeName}, saya sedang melihat katalog di sneering.biz.id!`
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      {settings.announcement && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-emerald-950/60 border-b border-emerald-900/30 py-1.5 px-4 text-center text-xs text-emerald-300 font-medium flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{settings.announcement}</span>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-zinc-950 font-black text-lg shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-white text-base sm:text-lg">
                SNEERING
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 tracking-wide border border-zinc-700/60">
                biz.id
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Merchandise MLBB • Gubeng, Surabaya
            </p>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct WhatsApp Chat */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all"
            title="Chat Langsung Pemilik via WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Owner</span>
          </a>

          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            type="button"
            className="relative flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all shadow-sm"
            aria-label="Buka Keranjang Borongan"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Keranjang</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-bold text-zinc-950">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Entry */}
          <Link
            href="/admin"
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            title="Masuk Dashboard Admin"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
