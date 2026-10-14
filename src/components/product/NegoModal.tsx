'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Handshake, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { createSingleItemWhatsAppUrl, formatRupiah } from '@/lib/whatsapp';
import { NEGO_RULES } from '@/lib/constants';

export const NegoModal: React.FC = () => {
  const { negoModal, closeNegoModal, settings, buyer, setBuyer } = useAppStore();
  const product = negoModal.product;

  const [isNego, setIsNego] = useState<boolean>(false);
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>(buyer.name || '');
  const [buyerCity, setBuyerCity] = useState<string>(buyer.city || '');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      // Default to nego if product allows it, otherwise harga pas
      if (product.negoRule === 'harga_pas') {
        setIsNego(false);
      } else {
        setIsNego(true);
        // Default offer suggestion: 90% of price
        const suggestion = Math.round((product.price * 0.9) / 10000) * 10000;
        setOfferPrice(suggestion.toString());
      }
      setBuyerName(buyer.name || '');
      setBuyerCity(buyer.city || '');
    }
  }, [product, buyer]);

  if (!negoModal.isOpen || !product) {
    return null;
  }

  const negoRuleMeta = NEGO_RULES.find((r) => r.value === product.negoRule);
  const numericOffer = parseInt(offerPrice.replace(/\D/g, ''), 10) || 0;

  const handlePriceChange = (val: string) => {
    const rawNumber = val.replace(/\D/g, '');
    setOfferPrice(rawNumber);
  };

  const handleSaveBuyer = () => {
    setBuyer({ name: buyerName, city: buyerCity });
  };

  const handleProceedWhatsApp = () => {
    handleSaveBuyer();
    const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://sneering.biz.id';
    const waUrl = createSingleItemWhatsAppUrl({
      product,
      whatsappNumber: settings.whatsappNumber,
      isNego: isNego && product.negoRule !== 'harga_pas',
      negoOfferPrice: numericOffer,
      buyerName: buyerName.trim() || undefined,
      buyerCity: buyerCity.trim() || undefined,
      currentHost,
    });
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    closeNegoModal();
  };

  const isSold = product.status === 'sold';
  const isBooked = product.status === 'booked';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 shadow-2xl text-zinc-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeNegoModal}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          aria-label="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Hubungi Penjual via WhatsApp</h3>
            <p className="text-xs text-zinc-400">Pilih beli harga pas atau ajukan penawaran wajar</p>
          </div>
        </div>

        {/* Product Card Summary */}
        <div className="flex gap-3.5 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 mb-5">
          {product.images[0] && (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-16 w-16 rounded-lg object-cover shrink-0 border border-zinc-800"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                {product.condition}
              </span>
              {negoRuleMeta && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${negoRuleMeta.badgeColor}`}>
                  {negoRuleMeta.label}
                </span>
              )}
            </div>
            <h4 className="text-xs font-semibold text-white truncate mt-1">{product.title}</h4>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-sm font-bold text-emerald-400">{formatRupiah(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {isSold ? (
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 text-center text-xs text-rose-300 mb-5">
            Barang ini sudah terjual (Sold Out). Namun kamu tetap bisa menanyakan ketersediaan barang serupa ke WhatsApp penjual!
          </div>
        ) : isBooked ? (
          <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 text-center text-xs text-amber-300 mb-5">
            Barang sedang dipesan/dibooking pembeli lain. Kamu bisa chat penjual untuk menjadi antrean berikutnya jika batal.
          </div>
        ) : null}

        {/* Nego / Harga Pas Option Selector */}
        {!isSold && (
          <div className="space-y-4 mb-5">
            <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Pilihan Transaksi:
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Option 1: Harga Pas */}
              <button
                type="button"
                onClick={() => setIsNego(false)}
                className={`flex flex-col items-start gap-1 rounded-xl p-3 border text-left transition-all ${
                  !isNego
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${!isNego ? 'text-emerald-400' : 'text-zinc-400'}`} />
                    Beli Harga Pas
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-[10px] text-zinc-400">Siap transfer / COD langsung</span>
              </button>

              {/* Option 2: Nego */}
              <button
                type="button"
                disabled={product.negoRule === 'harga_pas'}
                onClick={() => {
                  if (product.negoRule !== 'harga_pas') setIsNego(true);
                }}
                className={`flex flex-col items-start gap-1 rounded-xl p-3 border text-left transition-all ${
                  product.negoRule === 'harga_pas'
                    ? 'border-zinc-800/40 bg-zinc-950/30 opacity-50 cursor-not-allowed text-zinc-400'
                    : isNego
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Handshake className={`w-3.5 h-3.5 ${isNego ? 'text-emerald-400' : 'text-zinc-400'}`} />
                    Ajukan Nego
                  </span>
                </div>
                <span className="text-[11px] text-amber-400 font-semibold mt-0.5">
                  {product.negoRule === 'harga_pas' ? 'Harga Pas (Nett)' : 'Tawar Harga'}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {product.negoRule === 'harga_pas' ? 'Tidak terima nego' : 'Ketik nominal tawaran'}
                </span>
              </button>
            </div>

            {/* If Nego Selected: Input Tawaran */}
            {isNego && product.negoRule !== 'harga_pas' && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">
                    Nominal Tawaran Kamu (Rp)
                  </label>
                  {numericOffer > 0 && numericOffer < product.price && (
                    <span className="text-[11px] text-amber-400">
                      Diskon {Math.round(((product.price - numericOffer) / product.price) * 100)}%
                    </span>
                  )}
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 text-xs font-bold">
                    Rp
                  </div>
                  <input
                    type="text"
                    value={offerPrice ? parseInt(offerPrice, 10).toLocaleString('id-ID') : ''}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="Contoh: 3.400.000"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {product.negoRule === 'nego_tipis' && (
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Penjual menerapkan <em>Nego Tipis</em> (potongan wajar/ongkir).
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Optional Buyer Profile */}
        <div className="space-y-3 mb-5 border-t border-zinc-800/80 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-300">
              Identitas Pembeli <span className="text-zinc-400 font-normal">(Opsional)</span>
            </span>
            <span className="text-[10px] text-zinc-400">Tersimpan di browser kamu</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Nama Anda (cth: Dimas)"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-white placeholder-zinc-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                value={buyerCity}
                onChange={(e) => setBuyerCity(e.target.value)}
                placeholder="Kota/Kecamatan (cth: Jaksel)"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-white placeholder-zinc-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Message Preview Toggle */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            {showPreview ? 'Sembunyikan format pesan WA' : 'Lihat format pesan WhatsApp yang dikirim'}
          </button>

          {showPreview && (
            <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/90 p-3 text-[11px] text-zinc-300 font-mono whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
              {`Halo Admin *SNEERING*, saya tertarik dengan barang yang ada di katalog web:\n\n` +
                `🏷️ *Produk:* ${product.title}\n` +
                `📦 *Kondisi:* ${product.condition}\n` +
                `💰 *Harga:* ${formatRupiah(product.price)}\n` +
                (isNego && numericOffer > 0
                  ? `🤝 *Ajuan Nego:* ${formatRupiah(numericOffer)}\n`
                  : `✅ *Status:* Beli Harga Pas\n`) +
                (buyerName ? `\n👤 *Nama:* ${buyerName}` : '') +
                (buyerCity ? `\n📍 *Kota:* ${buyerCity}` : '')}
            </div>
          )}
        </div>

        {/* Submit to WhatsApp */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeNegoModal}
            className="w-1/3 rounded-xl border border-zinc-800 bg-zinc-800/50 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleProceedWhatsApp}
            className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-bold text-zinc-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25 active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Lanjut ke WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
