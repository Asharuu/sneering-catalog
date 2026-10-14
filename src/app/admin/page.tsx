'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Package,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  RotateCcw,
  ExternalLink,
  MessageSquare,
  Lock,
  Unlock,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Product, ProductStatus } from '@/types';
import { formatRupiah, normalizeWhatsAppNumber } from '@/lib/whatsapp';
import { STATUS_LABELS, NEGO_RULES } from '@/lib/constants';
import { ProductFormModal } from '@/components/admin/ProductFormModal';

export default function AdminPage() {
  const {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    resetToInitialProducts,
    settings,
    updateSettings,
  } = useAppStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');

  // Search & Filter in Admin
  const [adminSearch, setAdminSearch] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Settings Form State
  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [locationCity, setLocationCity] = useState(settings.locationCity);
  const [instagramHandle, setInstagramHandle] = useState(settings.instagramHandle || '');
  const [announcement, setAnnouncement] = useState(settings.announcement || '');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Stats calculation
  const totalItems = products.length;
  const readyItems = products.filter((p) => p.status === 'ready').length;
  const bookedItems = products.filter((p) => p.status === 'booked').length;
  const soldItems = products.filter((p) => p.status === 'sold').length;
  const totalValue = products
    .filter((p) => p.status === 'ready')
    .reduce((acc, p) => acc + p.price, 0);

  // PIN Login Handler (Server-side validation)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setAuthError('Silakan masukkan PIN Admin.');
      return;
    }
    setIsVerifying(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'PIN salah!');
      }
    } catch {
      setAuthError('Gagal memverifikasi PIN.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Add / Edit Product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (prod: Product) => {
    if (editingProduct) {
      updateProduct(prod.id, prod);
    } else {
      addProduct(prod);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah kamu yakin ingin menghapus "${title}" dari katalog?`)) {
      deleteProduct(id);
    }
  };

  // Save Store Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: storeName.trim(),
      tagline: tagline.trim(),
      whatsappNumber: normalizeWhatsAppNumber(whatsappNumber),
      ownerName: ownerName.trim(),
      locationCity: locationCity.trim(),
      instagramHandle: instagramHandle.trim() || undefined,
      announcement: announcement.trim() || undefined,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Export & Import JSON
  const handleExportJSON = () => {
    const dataToExport = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      products,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `katalog-sneering-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.products && Array.isArray(parsed.products)) {
          setProducts(parsed.products);
          if (parsed.settings) {
            updateSettings(parsed.settings);
          }
          alert('Berhasil mengimpor data katalog!');
        } else {
          alert('Format file JSON tidak sesuai.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  // PIN Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Dashboard Admin Sneering</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Masukkan PIN Admin untuk mengelola barang & pengaturan toko.
          </p>

          <form onSubmit={handleLogin} className="mt-5 space-y-3">
            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Masukkan PIN Admin"
              disabled={isVerifying}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-center text-sm text-white tracking-widest placeholder-zinc-500 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
            />
            {authError && <p className="text-xs text-rose-400">{authError}</p>}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isVerifying ? 'Memverifikasi...' : 'Masuk Dashboard'}
            </button>
          </form>

          <div className="mt-4 border-t border-zinc-800/80 pt-4">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Halaman Katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.condition.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            title="Kembali ke Katalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Admin Dashboard • {settings.storeName}
            </h1>
            <p className="text-xs text-zinc-400">
              Kelola stok barang, ubah status ketersediaan, dan pengaturan toko
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors"
          >
            Kunci / Keluar
          </button>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <span>Buka Web Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Metric Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="text-[11px] font-medium text-zinc-400">Total Koleksi</div>
          <div className="mt-1 text-xl sm:text-2xl font-black text-white">{totalItems}</div>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="text-[11px] font-medium text-emerald-400">Ready Stock</div>
          <div className="mt-1 text-xl sm:text-2xl font-black text-emerald-400">{readyItems}</div>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="text-[11px] font-medium text-amber-400">Booked</div>
          <div className="mt-1 text-xl sm:text-2xl font-black text-amber-400">{bookedItems}</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="text-[11px] font-medium text-zinc-400">Nilai Ready</div>
          <div className="mt-1 text-sm sm:text-lg font-bold text-white font-mono truncate">
            {formatRupiah(totalValue)}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Kelola Barang ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Toko & Backup</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Controls: Search & Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Cari barang di list admin..."
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none w-full sm:w-72"
            />

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Barang Baru</span>
            </button>
          </div>

          {/* Products List / Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/70">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Barang</th>
                  <th className="py-3 px-4">Kategori & Kondisi</th>
                  <th className="py-3 px-4">Harga</th>
                  <th className="py-3 px-4">Aturan Nego</th>
                  <th className="py-3 px-4">Status Cepat (1-Klik)</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredProducts.map((p) => {
                  const nego = NEGO_RULES.find((r) => r.value === p.negoRule);
                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="h-12 w-12 rounded-lg object-cover border border-zinc-800 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/p/${p.slug}`}
                              target="_blank"
                              className="font-semibold text-white hover:text-emerald-400 truncate block"
                            >
                              {p.title}
                            </Link>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span className="text-[10px] text-zinc-500 font-mono">
                                /p/{p.slug}
                              </span>
                              {p.stock !== undefined && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-zinc-800 text-emerald-300 rounded border border-zinc-700">
                                  Stok: {p.stock} pcs
                                </span>
                              )}
                              {p.video && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                                  📹 Video
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Condition */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-zinc-300 font-medium">{p.category}</div>
                        <div className="text-[11px] text-zinc-500">{p.condition}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-emerald-400">
                        {formatRupiah(p.price)}
                      </td>

                      {/* Nego Rule */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${nego?.badgeColor}`}>
                          {nego?.label}
                        </span>
                      </td>

                      {/* Quick 1-Click Status Selector */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {(['ready', 'booked', 'sold'] as ProductStatus[]).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => updateProductStatus(p.id, st)}
                              className={`px-2 py-1 rounded text-[10px] font-bold capitalize transition-all ${
                                p.status === st
                                  ? st === 'ready'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : st === 'booked'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                    : 'bg-zinc-700 text-zinc-200 border border-zinc-600'
                                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                            title="Edit Barang"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                            title="Hapus Barang"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="py-12 text-center text-xs text-zinc-500">
                Tidak ada barang yang cocok dengan pencarian.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STORE SETTINGS & DATA BACKUP */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Store Settings Form */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 sm:p-6 space-y-5">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" />
              Pengaturan Kontak & Toko
            </h3>

            {settingsSaved && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pengaturan berhasil disimpan!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-200">
                  Nomor WhatsApp Pemilik (Format: 628...) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Contoh: 6281234567890"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 font-mono text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Penting: Gunakan kode negara 62 di depan (bukan 08...). Pesan pembeli akan masuk ke nomor ini.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-200">Nama Toko / Katalog</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-200">Nama Owner / Penjual</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-200">Tagline / Slogan</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-200">Kota Lokasi (COD/Kirim)</label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="Jakarta Selatan"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-200">Instagram Handle</label>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@sneering.id"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-200">Pengumuman Banner Atas Web</label>
                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Tuliskan banner pengumuman..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 border-t border-zinc-800 pt-3">
                <label className="font-semibold text-zinc-200">Keamanan & PIN Admin</label>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  PIN Admin diamankan di sisi server via Environment Variable (<code className="text-emerald-400 font-mono">ADMIN_PIN</code>). Untuk mengubah PIN di live web, atur di Vercel (Settings &rarr; Environment Variables).
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </form>
          </div>

          {/* Right: Backup, Restore & Cloud Integration */}
          <div className="lg:col-span-5 space-y-6">
            {/* Backup & Restore */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                Backup & Restore Data JSON
              </h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Kamu bisa mendownload seluruh data barang dan pengaturan ke file JSON, atau mengunggah file cadangan kapan saja.
              </p>

              <div className="space-y-2">
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 font-bold text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Backup JSON</span>
                </button>

                <label className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 font-bold text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Upload Restore JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Reset to Default */}
              <div className="border-t border-zinc-800 pt-3">
                <button
                  onClick={() => {
                    if (confirm('Kembalikan semua barang ke contoh awal (sample demo)?')) {
                      resetToInitialProducts();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 hover:text-amber-400 transition-colors py-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ke Data Sampel Awal</span>
                </button>
              </div>
            </div>

            {/* Supabase Cloud Database Box */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-3 text-xs">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                Integrasi Database Supabase (Opsional)
              </h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Saat ini website berjalan dengan penyimpanan lokal berkecepatan tinggi di browser admin. Untuk menyimpan data ke cloud Supabase permanen, cukup isi file <code className="text-emerald-400">.env.local</code> dengan:
              </p>
              <pre className="rounded-lg bg-zinc-900 p-2.5 text-[10px] text-zinc-300 font-mono overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...`}
              </pre>
              <p className="text-[11px] text-zinc-500">
                Skema SQL lengkap sudah tersedia di file <code className="text-zinc-300 font-mono">supabase_schema.sql</code> di root proyek.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />
    </div>
  );
}
