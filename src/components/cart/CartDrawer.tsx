'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, MessageSquare, Handshake, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { createCartWhatsAppUrl, formatRupiah } from '@/lib/whatsapp';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, clearCart, settings, buyer, setBuyer } =
    useAppStore();

  const [isNegoBorongan, setIsNegoBorongan] = useState<boolean>(false);
  const [boronganPrice, setBoronganPrice] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>(buyer.name || '');
  const [buyerCity, setBuyerCity] = useState<string>(buyer.city || '');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const totalNormal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  useEffect(() => {
    setBuyerName(buyer.name || '');
    setBuyerCity(buyer.city || '');
    if (totalNormal > 0 && isNegoBorongan && !boronganPrice) {
      // Suggest 88% borongan discount
      const suggested = Math.round((totalNormal * 0.88) / 10000) * 10000;
      setBoronganPrice(suggested.toString());
    }
  }, [buyer, totalNormal, isNegoBorongan]);

  if (!isCartOpen) return null;

  const numericBorongan = parseInt(boronganPrice.replace(/\D/g, ''), 10) || 0;

  const handlePriceChange = (val: string) => {
    const rawNumber = val.replace(/\D/g, '');
    setBoronganPrice(rawNumber);
  };

  const handleProceedWhatsApp = () => {
    setBuyer({ name: buyerName, city: buyerCity });
    const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://sneering.biz.id';
    const waUrl = createCartWhatsAppUrl({
      cartItems: cart,
      whatsappNumber: settings.whatsappNumber,
      isNegoBorongan,
      boronganOfferPrice: numericBorongan,
      buyerName: buyerName.trim() || undefined,
      buyerCity: buyerCity.trim() || undefined,
      currentHost,
    });
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-900 text-zinc-100 shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Keranjang Borongan</h3>
              <p className="text-[11px] text-zinc-400">{cart.length} barang terpilih</p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            aria-label="Tutup Keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/60 text-zinc-400 mb-3 border border-zinc-700/50">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-semibold text-white">Keranjang Kosong</h4>
            <p className="mt-1 text-xs text-zinc-400 max-w-xs leading-relaxed">
              Kamu belum memasukkan barang. Pilih produk di katalog dan klik "+ Keranjang" untuk beli borongan sekaligus!
            </p>
            <button
              onClick={closeCart}
              className="mt-4 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              Jelajahi Katalog
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Items List */}
            <div className="space-y-2.5">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-2.5 transition-colors"
                >
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="h-14 w-14 rounded-lg object-cover shrink-0 border border-zinc-800"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-semibold text-white truncate">{item.product.title}</h5>
                    <p className="text-[10px] text-zinc-400">{item.product.condition}</p>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">
                      {formatRupiah(item.product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                    title="Hapus dari keranjang"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] text-zinc-400 hover:text-rose-400 transition-colors"
              >
                Kosongkan Keranjang
              </button>
            </div>

            {/* Borongan Nego Section */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNegoBorongan}
                    onChange={(e) => setIsNegoBorongan(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Handshake className="w-3.5 h-3.5 text-emerald-400" />
                    Ajukan Nego Borongan
                  </span>
                </label>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Hemat Borong
                </span>
              </div>

              {isNegoBorongan && (
                <div className="space-y-2 pt-1 border-t border-zinc-800/70">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Total Harga Normal:</span>
                    <span className="text-zinc-300 font-mono line-through">
                      {formatRupiah(totalNormal)}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 text-xs font-bold">
                      Rp
                    </div>
                    <input
                      type="text"
                      value={boronganPrice ? parseInt(boronganPrice, 10).toLocaleString('id-ID') : ''}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="Tawaran borongan total"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-400 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  {numericBorongan > 0 && numericBorongan < totalNormal && (
                    <p className="text-[10px] text-amber-400">
                      Hemat {formatRupiah(totalNormal - numericBorongan)} (Potongan{' '}
                      {Math.round(((totalNormal - numericBorongan) / totalNormal) * 100)}%)
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Optional Buyer Profile */}
            <div className="space-y-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5">
              <span className="text-xs font-medium text-zinc-300 block">
                Identitas Kamu <span className="text-zinc-400 font-normal">(Opsional)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-400 focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={buyerCity}
                  onChange={(e) => setBuyerCity(e.target.value)}
                  placeholder="Kota Domisili"
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Preview Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {showPreview ? 'Sembunyikan format chat WA' : 'Lihat format chat WhatsApp borongan'}
              </button>

              {showPreview && (
                <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/90 p-3 text-[11px] text-zinc-300 font-mono whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
                  {`Halo Admin *SNEERING*, saya ingin order borongan beberapa barang:\n\n` +
                    cart
                      .map(
                        (i, idx) =>
                          `${idx + 1}. *${i.product.title}* - ${formatRupiah(i.product.price)}`
                      )
                      .join('\n') +
                    `\n\n💵 *Total Normal:* ${formatRupiah(totalNormal)}\n` +
                    (isNegoBorongan && numericBorongan > 0
                      ? `🤝 *Tawaran Borongan:* ${formatRupiah(numericBorongan)}\n`
                      : `✅ *Status:* Beli Total Normal\n`) +
                    (buyerName ? `👤 *Nama:* ${buyerName}\n` : '') +
                    (buyerCity ? `📍 *Kota:* ${buyerCity}\n` : '')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Drawer Footer Summary */}
        {cart.length > 0 && (
          <div className="border-t border-zinc-800 bg-zinc-950/90 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total Tagihan:</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                {isNegoBorongan && numericBorongan > 0
                  ? formatRupiah(numericBorongan)
                  : formatRupiah(totalNormal)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleProceedWhatsApp}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-bold text-zinc-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25 active:scale-98"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Checkout Borongan via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-zinc-400 text-center">
              Pesan rapi otomatis dibuat dan membuka WhatsApp penjual
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
