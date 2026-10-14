'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Handshake,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilter } from '@/components/product/ProductFilter';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';
import { INITIAL_PRODUCTS, DEFAULT_SETTINGS } from '@/lib/constants';

export default function HomePage() {
  const { products, settings } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeProducts = mounted ? products : INITIAL_PRODUCTS;
  const activeSettings = mounted ? settings : DEFAULT_SETTINGS;

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedNegoRule, setSelectedNegoRule] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter((p) => {
        // Search filter
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.conditionNotes && p.conditionNotes.toLowerCase().includes(q));

        if (!matchesQuery) return false;

        // Category filter
        if (selectedCategory !== 'Semua Kategori' && p.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && p.status !== selectedStatus) {
          return false;
        }

        // Nego Rule filter
        if (selectedNegoRule !== 'all' && p.negoRule !== selectedNegoRule) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        // Default: newest first
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      });
  }, [activeProducts, searchQuery, selectedCategory, selectedStatus, selectedNegoRule, sortBy]);

  const cleanPhone = normalizeWhatsAppNumber(activeSettings.whatsappNumber);

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 space-y-6 sm:space-y-8">
      {/* Compact Top Header Banner (Produk langsung tampak tanpa terhalang hero raksasa) */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-zinc-950 p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                sneering.biz.id
              </span>
              <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Stok Live & Siap Kirim / COD
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              {activeSettings.storeName} •{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Merchandise Mobile Legends
              </span>
            </h1>

            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Koleksi Eksklusif Mapzone & Merchandise Reguler MLBB. Berlokasi di <strong className="text-emerald-400 font-semibold">{activeSettings.locationCity}</strong> (Siap COD / Kirim). Semua barang bisa dinego santai, langsung chat WhatsApp saja!
            </p>
          </div>

          {/* Quick Badges & Direct WhatsApp Button */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-300">
              <span className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Foto Asli
              </span>
              <span className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 flex items-center gap-1">
                <Handshake className="w-3 h-3 text-emerald-400" />
                Bisa Nego
              </span>
            </div>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                'Halo kak, saya mau tanya-tanya barang yang ada di katalog sneering.biz.id!'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-bold text-zinc-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat WhatsApp Penjual</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Catalog Section - Langsung Tampil di Atas */}
      <section className="space-y-5">
        {/* Filter Bar */}
        <ProductFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedNegoRule={selectedNegoRule}
          setSelectedNegoRule={setSelectedNegoRule}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalFiltered={filteredProducts.length}
          totalProducts={activeProducts.length}
        />

        {/* Products Grid Langsung Tertampil */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-12 text-center text-zinc-400 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500 border border-zinc-800">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-white">Tidak Ada Barang yang Cocok</h3>
            <p className="text-xs max-w-sm mx-auto text-zinc-500">
              Coba gunakan kata kunci pencarian yang berbeda atau ubah pilihan filter di atas.
            </p>
          </div>
        )}
      </section>

      {/* How It Works (Alur Transaksi Mudah) di Bawah Produk */}
      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-5 sm:p-8 space-y-6 mt-12">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            Simpel & Tanpa Ribet
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white">
            Cara Belanja & Nego di Sneering
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Tanpa perlu registrasi akun, tanpa potongan biaya platform. Semua transaksi dilakukan langsung antara kamu dan penjual via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-extrabold text-xs border border-emerald-500/20">
              1
            </div>
            <h3 className="text-xs font-bold text-white">Pilih Barang</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Jelajahi galeri foto dan baca spesifikasi serta catatan minus barang secara transparan.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 font-extrabold text-xs border border-teal-500/20">
              2
            </div>
            <h3 className="text-xs font-bold text-white">Tentukan Harga / Nego</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Pilih beli harga pas atau isi nominal tawaran nego wajar (bisa 1 barang atau borongan via keranjang).
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-extrabold text-xs border border-indigo-500/20">
              3
            </div>
            <h3 className="text-xs font-bold text-white">Chat Otomatis ke WA</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Sistem langsung menyusun format pesan rapi berisi nama barang, harga, dan ajuan negomu ke WhatsApp penjual.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 font-extrabold text-xs border border-amber-500/20">
              4
            </div>
            <h3 className="text-xs font-bold text-white">Deal & Kirim / COD</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Sepakati ongkos kirim atau janji COD, transfer langsung ke rekening penjual, dan barang siap dikirim!
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            Pertanyaan Umum
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white">
            FAQ Seputar Transaksi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-5xl mx-auto text-xs">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1.5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              Apakah semua barang bisa ditawar?
            </h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Tergantung aturan pada masing-masing barang. Barang bertanda <em>Bisa Nego</em> atau <em>Nego Tipis</em> terbuka untuk penawaran. Sementara barang bertanda <em>Harga Pas</em> dijual dengan harga nett terbaik.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1.5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              Kenapa transaksi langsung via WhatsApp?
            </h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Karena ini katalog koleksi pribadi, transaksi langsung via WhatsApp membuat harga lebih bersahabat tanpa potongan biaya admin marketplace (3–7%), dan kamu bisa langsung minta video fisik atau cek fungsi barang ke penjual secara leluasa.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1.5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              Bagaimana metode pembayaran dan pengiriman?
            </h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Pembayaran via QRIS, Cash (tunai saat COD), atau transfer bank. Pengiriman bisa menggunakan Paxel, JNE, SiCepat, atau kurir instan Grab/Gojek sesuai kesepakatan saat chat di WhatsApp.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1.5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              Apakah melayani COD (Cash on Delivery)?
            </h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Bisa banget! Untuk wilayah {activeSettings.locationCity} dan sekitarnya, kita bisa janjian ketemuan di tempat umum yang aman untuk cek fisik barang langsung sebelum bayar.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
