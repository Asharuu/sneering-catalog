export type ProductCondition = 'Baru' | 'Bekas (Mulus)' | 'Bekas (Normal)' | 'Bekas (Minus)';

export type ProductStatus = 'ready' | 'booked' | 'sold';

export type NegoRule = 'bisa_nego' | 'nego_tipis' | 'harga_pas';

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: ProductCondition;
  conditionNotes?: string;
  status: ProductStatus;
  negoRule: NegoRule;
  images: string[];
  video?: string; // URL video preview (.mp4 / webm atau embed)
  stock?: number;
  stockBreakdown?: string; // Keterangan stok: e.g. "Tersedia 2 unit"
  hasFriendItem?: boolean;
  specs?: Record<string, string>;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string; // E.g., "6281234567890" (tanpa tanda + atau spasi)
  ownerName: string;
  locationCity: string;
  instagramHandle?: string;
  announcement?: string;
  whatsappTemplateSingle?: string;
  whatsappTemplateCart?: string;
  adminPin?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BuyerProfile {
  name: string;
  city: string;
}
