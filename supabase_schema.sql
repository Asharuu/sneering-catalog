-- =========================================================================
-- SNEERING CATALOG (sneering.biz.id) - SUPABASE DATABASE SCHEMA
-- Jalankan query ini di SQL Editor dashboard Supabase Anda.
-- =========================================================================

-- 1. Tabel Produk
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price BIGINT NOT NULL,
    original_price BIGINT,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    condition_notes TEXT,
    status TEXT NOT NULL DEFAULT 'ready', -- ready, booked, sold
    nego_rule TEXT NOT NULL DEFAULT 'bisa_nego', -- bisa_nego, nego_tipis, harga_pas
    images TEXT[] NOT NULL DEFAULT '{}',
    specs JSONB DEFAULT '{}'::jsonb,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Pengaturan Toko
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    store_name TEXT NOT NULL DEFAULT 'SNEERING CATALOG',
    tagline TEXT NOT NULL DEFAULT 'Koleksi Pribadi & Preloved Terawat',
    whatsapp_number TEXT NOT NULL DEFAULT '62895635595069',
    owner_name TEXT NOT NULL DEFAULT 'Admin Sneering',
    location_city TEXT NOT NULL DEFAULT 'Jakarta Selatan',
    instagram_handle TEXT DEFAULT '@sneering.id',
    announcement TEXT DEFAULT 'Transaksi langsung via WhatsApp tanpa perantara & tanpa biaya tambahan!',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policy: Publik bisa membaca produk dan pengaturan (SELECT)
CREATE POLICY "Public Read Products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Public Read Settings" ON public.settings
    FOR SELECT USING (true);

-- Policy: Hanya Admin (terotentikasi) yang dapat mengubah data
CREATE POLICY "Admin Insert Products" ON public.products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin Update Products" ON public.products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Products" ON public.products
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin Update Settings" ON public.settings
    FOR ALL USING (auth.role() = 'authenticated');

-- 4. Storage Bucket untuk Foto Produk (Opsional jika ingin upload foto ke Supabase)
-- Jalankan di Supabase Storage: Buat public bucket bernama "product-images"
