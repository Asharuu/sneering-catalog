import { CartItem, Product } from '@/types';

/**
 * Format angka ke format mata uang Rupiah Indonesia
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Normalisasi nomor WhatsApp menjadi format internasional (e.g., 0812 -> 62812)
 */
export function normalizeWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  if (cleaned.startsWith('8')) {
    return '62' + cleaned;
  }
  return cleaned;
}

interface SingleItemWhatsAppParams {
  product: Product;
  whatsappNumber: string;
  isNego: boolean;
  negoOfferPrice?: number;
  buyerName?: string;
  buyerCity?: string;
  currentHost?: string;
}

/**
 * Membuat tautan WhatsApp untuk pemesanan satu barang (Quick Modal / Product Detail)
 */
export function createSingleItemWhatsAppUrl({
  product,
  whatsappNumber,
  isNego,
  negoOfferPrice,
  buyerName,
  buyerCity,
  currentHost = 'https://sneering.biz.id',
}: SingleItemWhatsAppParams): string {
  const cleanPhone = normalizeWhatsAppNumber(whatsappNumber);
  const productUrl = `${currentHost.replace(/\/$/, '')}/p/${product.slug}`;

  const lines: string[] = [
    `Halo Admin *SNEERING*, saya tertarik dengan barang yang ada di katalog web:`,
    ``,
    `🏷️ *Produk:* ${product.title}`,
    `📦 *Kondisi:* ${product.condition}`,
    `💰 *Harga Tertera:* ${formatRupiah(product.price)}`,
  ];

  if (isNego && negoOfferPrice && negoOfferPrice > 0) {
    lines.push(`🤝 *Ajuan Nego:* ${formatRupiah(negoOfferPrice)} (Bisa dilepas di harga ini, Kak?)`);
  } else {
    lines.push(`✅ *Status Harga:* Beli dengan Harga Pas (${formatRupiah(product.price)})`);
  }

  lines.push(``);
  lines.push(`🔗 *Link Produk:* ${productUrl}`);

  if (buyerName || buyerCity) {
    lines.push(``);
    lines.push(`👤 *Data Calon Pembeli:*`);
    if (buyerName) lines.push(`• Nama: ${buyerName}`);
    if (buyerCity) lines.push(`• Domisili/Kota: ${buyerCity}`);
  }

  lines.push(``);
  lines.push(`Apakah barang ini masih ready? Mohon info detail dan nomor rekeningnya ya kak. Terima kasih! 🙏`);

  const messageText = lines.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
}

interface CartWhatsAppParams {
  cartItems: CartItem[];
  whatsappNumber: string;
  isNegoBorongan: boolean;
  boronganOfferPrice?: number;
  buyerName?: string;
  buyerCity?: string;
  currentHost?: string;
}

/**
 * Membuat tautan WhatsApp untuk Checkout Keranjang Borongan (Multi-Barang)
 */
export function createCartWhatsAppUrl({
  cartItems,
  whatsappNumber,
  isNegoBorongan,
  boronganOfferPrice,
  buyerName,
  buyerCity,
  currentHost = 'https://sneering.biz.id',
}: CartWhatsAppParams): string {
  const cleanPhone = normalizeWhatsAppNumber(whatsappNumber);
  const totalNormal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const lines: string[] = [
    `Halo Admin *SNEERING*, saya ingin order borongan beberapa barang dari katalog web:`,
    ``,
    `🛒 *DAFTAR PESANAN:*`,
  ];

  cartItems.forEach((item, index) => {
    lines.push(
      `${index + 1}. *${item.product.title}* (${item.product.condition}) - ${formatRupiah(item.product.price)}`
    );
  });

  lines.push(``);
  lines.push(`💵 *Total Harga Normal:* ${formatRupiah(totalNormal)}`);

  if (isNegoBorongan && boronganOfferPrice && boronganOfferPrice > 0) {
    lines.push(`🤝 *Tawaran Borongan:* ${formatRupiah(boronganOfferPrice)} (Apakah bisa ambil borongan semua ini?)`);
  } else {
    lines.push(`✅ *Status:* Order langsung total normal tanpa nego`);
  }

  if (buyerName || buyerCity) {
    lines.push(``);
    lines.push(`👤 *Data Calon Pembeli:*`);
    if (buyerName) lines.push(`• Nama: ${buyerName}`);
    if (buyerCity) lines.push(`• Domisili/Kota: ${buyerCity}`);
  }

  lines.push(``);
  lines.push(`🔗 *Katalog:* ${currentHost}`);
  lines.push(``);
  lines.push(`Apakah barang-barang di atas masih ready semua? Boleh minta rincian ongkir & rekeningnya kak? Terima kasih! 🙏`);

  const messageText = lines.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
}
