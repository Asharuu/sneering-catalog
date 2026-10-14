'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

interface ProductFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedNegoRule: string;
  setSelectedNegoRule: (n: string) => void;
  sortBy: 'newest' | 'price_asc' | 'price_desc';
  setSortBy: (s: 'newest' | 'price_asc' | 'price_desc') => void;
  totalFiltered: number;
  totalProducts: number;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedNegoRule,
  setSelectedNegoRule,
  sortBy,
  setSortBy,
  totalFiltered,
  totalProducts,
}) => {
  const isFiltered =
    searchQuery !== '' ||
    selectedCategory !== 'Semua Kategori' ||
    selectedStatus !== 'all' ||
    selectedNegoRule !== 'all' ||
    sortBy !== 'newest';

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('Semua Kategori');
    setSelectedStatus('all');
    setSelectedNegoRule('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-4 sm:p-5">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari barang, tipe, spesifikasi..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-white placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-9 pr-8 text-xs font-semibold text-zinc-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
            </select>
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-xs text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
              title="Reset semua filter"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                : 'border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Secondary Quick Filters: Status & Nego Rule */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/60 text-xs text-zinc-400">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Semua Status
            </button>
            <button
              onClick={() => setSelectedStatus('ready')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedStatus === 'ready'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ready Saja
            </button>
            <button
              onClick={() => setSelectedStatus('booked')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedStatus === 'booked'
                  ? 'bg-amber-500/20 text-amber-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Booked
            </button>
            <button
              onClick={() => setSelectedStatus('sold')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedStatus === 'sold'
                  ? 'bg-zinc-700 text-zinc-200 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Terjual
            </button>
          </div>

          {/* Nego Rule Quick Filter */}
          <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setSelectedNegoRule('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedNegoRule === 'all'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Semua Aturan
            </button>
            <button
              onClick={() => setSelectedNegoRule('bisa_nego')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedNegoRule === 'bisa_nego'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Bisa Nego
            </button>
            <button
              onClick={() => setSelectedNegoRule('harga_pas')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedNegoRule === 'harga_pas'
                  ? 'bg-rose-500/20 text-rose-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Harga Pas
            </button>
          </div>
        </div>

        {/* Counter */}
        <div className="text-[11px] text-zinc-400">
          Menampilkan <span className="text-white font-bold">{totalFiltered}</span> dari{' '}
          {totalProducts} barang
        </div>
      </div>
    </div>
  );
};
