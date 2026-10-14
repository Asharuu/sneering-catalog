'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Video, Package, Upload } from 'lucide-react';
import { Product, ProductCondition, ProductStatus, NegoRule } from '@/types';
import { CATEGORIES } from '@/lib/constants';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialProduct?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[1]);
  const [condition, setCondition] = useState<ProductCondition>('Baru');
  const [conditionNotes, setConditionNotes] = useState('');
  const [status, setStatus] = useState<ProductStatus>('ready');
  const [negoRule, setNegoRule] = useState<NegoRule>('bisa_nego');
  const [stock, setStock] = useState('1');
  const [stockBreakdown, setStockBreakdown] = useState('');
  const [hasFriendItem, setHasFriendItem] = useState(false);
  const [video, setVideo] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'Lokasi', value: 'Gubeng, Surabaya' },
  ]);

  useEffect(() => {
    if (initialProduct) {
      setTitle(initialProduct.title);
      setSlug(initialProduct.slug);
      setPrice(initialProduct.price.toString());
      setOriginalPrice(initialProduct.originalPrice ? initialProduct.originalPrice.toString() : '');
      setCategory(initialProduct.category);
      setCondition(initialProduct.condition);
      setConditionNotes(initialProduct.conditionNotes || '');
      setStatus(initialProduct.status);
      setNegoRule(initialProduct.negoRule);
      setStock(initialProduct.stock !== undefined ? initialProduct.stock.toString() : '1');
      setStockBreakdown(initialProduct.stockBreakdown || '');
      setHasFriendItem(Boolean(initialProduct.hasFriendItem));
      setVideo(initialProduct.video || '');
      setDescription(initialProduct.description);
      setImages(initialProduct.images.length > 0 ? initialProduct.images : ['']);
      if (initialProduct.specs) {
        setSpecs(
          Object.entries(initialProduct.specs).map(([key, value]) => ({ key, value }))
        );
      } else {
        setSpecs([]);
      }
    } else {
      // Reset form
      setTitle('');
      setSlug('');
      setPrice('');
      setOriginalPrice('');
      setCategory(CATEGORIES[1]);
      setCondition('Baru');
      setConditionNotes('');
      setStatus('ready');
      setNegoRule('bisa_nego');
      setStock('1');
      setStockBreakdown('');
      setHasFriendItem(false);
      setVideo('');
      setDescription('');
      setImages(['']);
      setSpecs([{ key: 'Lokasi', value: 'Gubeng, Surabaya' }]);
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  // Auto-generate slug from title if new product
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialProduct) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleUpdateImage = (index: number, val: string) => {
    const updated = [...images];
    updated[index] = val;
    setImages(updated);
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      setImages(['']);
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  // Direct file uploads for photos
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImages((prev) => {
            const filtered = prev.filter((img) => img.trim().length > 0);
            return [...filtered, result];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Direct file upload for video
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setVideo(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleUpdateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanImages = images.map((img) => img.trim()).filter((img) => img.length > 0);
    const specsRecord: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsRecord[s.key.trim()] = s.value.trim();
      }
    });

    const parsedPrice = parseInt(price.replace(/\D/g, ''), 10) || 0;
    const parsedOriginalPrice = originalPrice ? parseInt(originalPrice.replace(/\D/g, ''), 10) : undefined;
    const parsedStock = parseInt(stock.replace(/\D/g, ''), 10) || 0;

    const finalProduct: Product = {
      id: initialProduct ? initialProduct.id : `prod-${Date.now()}`,
      slug: slug.trim() || `item-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      category,
      condition,
      conditionNotes: conditionNotes.trim() || undefined,
      status,
      negoRule,
      stock: parsedStock,
      stockBreakdown: stockBreakdown.trim() || undefined,
      hasFriendItem,
      video: video.trim() || undefined,
      images: cleanImages,
      specs: Object.keys(specsRecord).length > 0 ? specsRecord : undefined,
      createdAt: initialProduct ? initialProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 shadow-2xl text-zinc-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <h3 className="font-bold text-base text-white">
            {initialProduct ? 'Edit Barang' : 'Tambah Barang Baru'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Slug */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200">Nama Barang *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Tas Layla (Limited Edition Eksklusif Mapzone)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200">URL Slug (Otomatis)</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tas-layla-eksklusif-mapzone"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-zinc-300 font-mono text-[11px] focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-200">Harga Jual (Rp) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contoh: 75000"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 text-white font-mono placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-200">Harga Coret / Asli (Rp) (Opsional)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Contoh: 95000"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 text-white font-mono placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Stok */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-200">Jumlah Stok (Pcs)</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Contoh: 2"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-zinc-200">Keterangan Stok</label>
              <input
                type="text"
                value={stockBreakdown}
                onChange={(e) => setStockBreakdown(e.target.value)}
                placeholder="Contoh: Tersedia 2 unit mulus"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category, Condition, Nego Rule */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-200">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.filter((c) => c !== 'Semua Kategori').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-200">Kondisi Fisik</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Baru">Baru</option>
                <option value="Bekas (Mulus)">Bekas (Mulus)</option>
                <option value="Bekas (Normal)">Bekas (Normal)</option>
                <option value="Bekas (Minus)">Bekas (Minus)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-200">Aturan Nego</label>
              <select
                value={negoRule}
                onChange={(e) => setNegoRule(e.target.value as NegoRule)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2 text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="bisa_nego">Bisa Nego</option>
                <option value="nego_tipis">Nego Tipis</option>
                <option value="harga_pas">Harga Pas (Nett)</option>
              </select>
            </div>
          </div>

          {/* Status Ketersediaan */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200">Status Ketersediaan</label>
            <div className="flex gap-2">
              {(['ready', 'booked', 'sold'] as ProductStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`flex-1 py-2 rounded-xl border font-bold capitalize transition-all ${
                    status === st
                      ? st === 'ready'
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                        : st === 'booked'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                        : 'border-zinc-500 bg-zinc-700 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  {st === 'ready' ? 'Ready' : st === 'booked' ? 'Booked' : 'Sold Out'}
                </button>
              ))}
            </div>
          </div>

          {/* Video Preview Section */}
          <div className="space-y-2 border-t border-zinc-800 pt-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-indigo-400" />
                Video Preview Fisik (Opsional)
              </label>

              {/* Video upload from laptop */}
              <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-bold text-indigo-300 hover:bg-indigo-500/20 transition-colors">
                <Upload className="w-3 h-3" />
                <span>Pilih File Video</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <input
              type="text"
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              placeholder="Tempel link URL video atau /videos/nama-video.mp4"
              className="w-full rounded-xl border border-indigo-900/60 bg-zinc-950 p-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none text-[11px] font-mono"
            />
          </div>

          {/* Condition Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200">
              Catatan Kondisi / Detail Minus (Opsional)
            </label>
            <input
              type="text"
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              placeholder="Contoh: Baru mulus, eksklusif event Mapzone"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-200">Deskripsi Barang *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail barang..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Multi-photo Image Section */}
          <div className="space-y-2 border-t border-zinc-800 pt-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                Foto Produk (Bisa Upload atau Masukkan Path / URL)
              </label>

              <div className="flex items-center gap-2">
                {/* Upload File button */}
                <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors">
                  <Upload className="w-3 h-3" />
                  <span>Pilih Foto dari Komputer</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleAddImage}
                  className="text-[11px] text-zinc-400 hover:text-white font-semibold flex items-center gap-1 border border-zinc-700 px-2 py-1 rounded-lg"
                >
                  <Plus className="w-3 h-3" /> Tambah Baris
                </button>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500">
              Tips: Kamu bisa klik tombol &ldquo;Pilih Foto dari Komputer&rdquo; di atas, atau taruh file fotomu di folder <code className="text-emerald-400">public/products/</code> lalu ketik misalnya: <code className="text-zinc-300">/products/tas-layla.jpg</code>.
            </p>

            <div className="space-y-2">
              {images.map((img, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  {img.trim() && (
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="h-9 w-9 rounded-lg object-cover border border-zinc-700 shrink-0 bg-zinc-950"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => handleUpdateImage(idx, e.target.value)}
                    placeholder="/products/nama-foto.jpg atau https://..."
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-white text-[11px] font-mono placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-2 text-zinc-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Specs / Kelengkapan (Key - Value) */}
          <div className="space-y-2 border-t border-zinc-800 pt-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-200">
                Spesifikasi & Informasi (Opsional)
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah Spek
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((s, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={s.key}
                    onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                    placeholder="Contoh: Lokasi"
                    className="w-1/3 rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={s.value}
                    onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                    placeholder="Contoh: Gubeng, Surabaya"
                    className="w-2/3 rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Row */}
          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-800 px-4 py-2 font-semibold text-zinc-300 hover:bg-zinc-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-5 py-2 font-bold text-zinc-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {initialProduct ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
