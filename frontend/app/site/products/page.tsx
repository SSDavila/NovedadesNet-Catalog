'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from './hooks/useProducts';
import CategorySidebar from './components/CategorySidebar';
import ProductGrid from './components/ProductGrid';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ProductModal from './components/ProductModal';
import { Product } from '@/interfaces/index';
import { Icon } from '@iconify/react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, isLoading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    return selectedCategory
      ? products.filter(p => p.category?.categoryName === selectedCategory)
      : products;
  }, [products, selectedCategory]);

  return (
    <div className="bg-white min-h-screen relative">
      {/* Background Decor */}
      <div className="absolute -top-20 inset-x-0 bottom-0 overflow-hidden pointer-events-none bg-slate-50/20">
        {/* Main Page Style Grid - Extended Coverage */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.45]"
          style={{
            maskImage: 'linear-gradient(to bottom, #000 70%, transparent 100%)',
          }}
        ></div>

        {/* Decorative Floating Geometry */}
        <div className="absolute top-[5%] left-[5%] w-32 h-32 border border-purple-200/30 rounded-full animate-spin-slow" />
        <div className="absolute top-[15%] right-[10%] w-24 h-24 border border-yellow-200/40 rounded-lg rotate-12" />
        <div className="absolute bottom-[20%] left-[15%] w-40 h-40 border border-indigo-100/30 rounded-full" />
        <div className="absolute bottom-[5%] right-[20%] w-16 h-16 border border-yellow-100/40 rounded-full animate-bounce-slow" />

        {/* Rich Mesh Gradient Base */}
        <div className="absolute inset-0 opacity-[0.6] bg-[radial-gradient(at_0%_0%,rgba(168,85,247,0.12)_0%,transparent_50%),radial-gradient(at_100%_100%,rgba(234,179,8,0.12)_0%,transparent_50%)]" />

        {/* Vibrant Organic Shapes */}
        <div className="absolute -top-[15%] -left-[10%] w-[800px] h-[800px] bg-purple-200/30 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[700px] h-[700px] bg-yellow-100/40 rounded-full blur-[140px]" />

        {/* Subtle Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">
          {/* Sidebar & Navigation Column */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-10">
              {/* Vertical Header - Aligned with Categories */}
              <header className="px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-[1.1]"
                >
                  Nuestras <br />
                  <span className="text-purple-600">Novedades</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 text-sm text-gray-400 font-medium leading-relaxed"
                >
                  Selección curada de productos premium.
                </motion.p>
              </header>

              {!isLoading && !error && (
                <CategorySidebar
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              )}
            </div>
          </aside>

          {/* Main Content Column */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center pt-20"
                >
                  <LoadingSpinner />
                  <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                    Cargando catálogo...
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-20"
                >
                  <ErrorMessage message={error} />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProductGrid
                    products={filteredProducts}
                    onProductClick={setSelectedProduct}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
