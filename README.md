# SNEERING CATALOG (`sneering.biz.id`)

Katalog web personal modern untuk koleksi barang pribadi & preloved terawat dengan sistem transaksi dan penawaran (nego) langsung via WhatsApp tanpa perantara dan tanpa potongan biaya admin platform.

---

## 🌟 Fitur Utama

1. **Transaksi Langsung via WhatsApp:**
   - **Beli Harga Pas:** Checkout langsung dengan harga normal tertera.
   - **Ajukan Nego Santai:** Pembeli bisa memasukkan nominal penawaran wajar sesuai aturan barang (*Bisa Nego*, *Nego Tipis*, atau *Harga Pas*).
   - **Keranjang Borongan (Multi-Barang):** Pengunjung bisa memasukkan beberapa barang sekaligus dan mengajukan nego borongan total.
   - **Pesan Otomatis Rapi:** Format chat WhatsApp otomatis menyertakan nama produk, kondisi, harga, status nego, dan link halaman produk.

2. **Katalog & Filter Interaktif:**
   - Pencarian instan berdasarkan judul, kategori, dan kata kunci spesifikasi.
   - Filter kategori, status (*Ready*, *Booked*, *Terjual*), dan aturan nego.
   - Galeri multi-foto dengan zoom dan indikator gambar.

3. **Dashboard Admin (`/admin`):**
   - **Proteksi PIN:** Akses dashboard dengan PIN (Default: `1234`, dapat diubah di menu pengaturan).
   - **Kelola Barang (CRUD):** Tambah barang baru, edit foto, harga, kondisi fisik, catatan minus, dan aturan nego.
   - **Ganti Status 1-Klik:** Ubah ketersediaan (*Ready* ↔ *Booked* ↔ *Sold Out*) secara instan.
   - **Pengaturan Toko:** Ubah nomor WhatsApp penerima pesanan, nama toko, domisili, dan banner pengumuman.
   - **Backup & Restore:** Download & upload cadangan data dalam format JSON.

4. **Kesiapan Cloud Supabase:**
   - Skema database PostgreSQL & Storage siap pakai tersedia di file [`supabase_schema.sql`](./supabase_schema.sql).
   - Mendukung mode offline/lokal (tanpa setup awal langsung jalan) maupun cloud Supabase cukup dengan memasukkan variabel di `.env.local`.

---

## 🚀 Cara Menjalankan Project

```bash
# Jalankan development server
pnpm dev

# Build untuk production
pnpm build

# Jalankan production server
pnpm start
```

Akses website di browser:
- Halaman Katalog Publik: [http://localhost:3000](http://localhost:3000)
- Dashboard Admin: [http://localhost:3000/admin](http://localhost:3000/admin) *(PIN diatur via environment variable `ADMIN_PIN`)*

---

## 🌐 Menghubungkan Domain `sneering.biz.id` di Vercel

1. Push repository ini ke GitHub.
2. Buka [Vercel](https://vercel.com) dan impor repository ini.
3. Masuk ke **Project Settings** → **Domains** di Vercel, lalu tambahkan domain Anda.
4. Ikuti instruksi DNS otomatis yang disediakan oleh dashboard Vercel.
