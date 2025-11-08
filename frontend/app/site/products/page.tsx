'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from './hooks/useProducts';
import CategorySidebar from './components/CategorySidebar';
import ProductGrid from './components/ProductGrid';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { containerVariants, itemVariants } from './animations/variants';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { products, isLoading, error } = useProducts();

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category?.categoryName === selectedCategory)
    : products;

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-yellow-50 opacity-50"></div>
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]"
          style={{
            maskImage:
              'radial-gradient(ellipse 80% 50% at 50% 0%,#000 70%,transparent 110%)',
          }}
        ></div>
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-yellow-500 text-transparent bg-clip-text pb-4"
            style={{ backgroundImage: 'linear-gradient(to right, #7c3aed, #eab308)' }}
          >
            Nuestro Catálogo
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Explora nuestra colección de productos únicos e innovadores.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {!isLoading && !error && products.length > 0 && (
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}
          <main className="flex-1 min-w-0">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && <ProductGrid products={filteredProducts} />}
          </main>
        </div>
      </motion.div>
    </div>
  );
}
