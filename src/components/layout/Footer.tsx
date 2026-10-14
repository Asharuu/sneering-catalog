'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, ShieldCheck, Zap, Handshake, MapPin } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  const { settings } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSettings = mounted ? settings : DEFAULT_SETTINGS;
  const cleanPhone = normalizeWhatsAppNumber(activeSettings.whatsappNumber);

  return (
    <footer className="mt-20 border-t border-zinc-800/80 bg-zinc-950/60 text-zinc-400">
      {/* Value Proposition Highlights */}
      <div className="border-b border-zinc-800/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Bisa Nego Santai</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  Terbuka untuk penawaran harga wajar langsung ke penjual via WhatsApp tanpa perantara.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Kondisi Transparan</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  Semua barang preloved dijelaskan kondisi fisik & catatan minus apa adanya beserta foto asli.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Tanpa Biaya Admin</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  Bebas biaya admin & fee platform pihak ketiga. Transaksi langsung via QRIS / Cash / COD.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-white text-base">
                {activeSettings.storeName}
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                sneering.biz.id
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {activeSettings.tagline} • Berlokasi di {activeSettings.locationCity}. Hubungi langsung penjual untuk menanyakan video detail barang atau janji COD.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeSettings.locationCity}</span>
              {activeSettings.instagramHandle && (
                <>
                  <span>•</span>
                  <span>Instagram: {activeSettings.instagramHandle}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat WhatsApp (+{cleanPhone})</span>
            </a>
            <Link
              href="/admin"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors underline-offset-4 hover:underline"
            >
              Kelola Toko (Admin)
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800/60 pt-6 text-center text-xs text-zinc-400 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
          <p>© 2026 sneering.biz.id. All rights reserved.</p>
          <p className="text-[11px] text-zinc-400">
            Dibuat untuk transaksi mudah, cepat, dan transparan via WhatsApp.
          </p>
        </div>
      </div>
    </footer>
  );
};
