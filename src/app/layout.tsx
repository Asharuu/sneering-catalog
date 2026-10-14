import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NegoModal } from '@/components/product/NegoModal';
import { CartDrawer } from '@/components/cart/CartDrawer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sneering.biz.id'),
  title: 'SNEERING | Katalog Pribadi & Preloved Collection',
  description:
    'Katalog barang preloved & koleksi pribadi pilihan. Beli langsung atau ajukan penawaran nego santai via WhatsApp langsung ke penjual.',
  keywords: ['katalog pribadi', 'preloved', 'sneering', 'jual beli santai', 'nego whatsapp'],
  authors: [{ name: 'Sneering' }],
  openGraph: {
    title: 'SNEERING | Katalog Pribadi & Preloved Collection',
    description:
      'Katalog barang preloved & koleksi pribadi pilihan. Transaksi langsung via WhatsApp tanpa perantara & tanpa biaya tambahan.',
    url: 'https://sneering.biz.id',
    siteName: 'SNEERING CATALOG',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SNEERING | Katalog Pribadi & Preloved Collection',
    description:
      'Koleksi pribadi terawat. Beli atau nego langsung via WhatsApp tanpa perantara.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#090a0f] text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <NegoModal />
        <CartDrawer />
      </body>
    </html>
  );
}
