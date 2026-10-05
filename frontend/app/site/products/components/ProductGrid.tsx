'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/interfaces/index';
import ProductCard from './ProductCard';
import { Icon } from '@iconify/react';

const PRODUCTS_PER_PAGE = 12;

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the product list changes (e.g. category filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build page number array with ellipsis logic
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-8">
      <AnimatePresence mode="popLayout">
        {paginatedProducts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center pt-24 pb-12"
          >
            <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
              <Icon icon="ph:package-light" width="40" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tighter">No hay productos</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-[240px] text-center leading-relaxed">
              No hemos encontrado coincidencias con los filtros seleccionados.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`grid-page-${currentPage}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            layout
            className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 xl:gap-8"
          >
            {paginatedProducts.map(product => (
              <ProductCard
                key={product.productId}
                product={product}
                onCardClick={onProductClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Controls */}
      {products.length > 0 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 pt-4 pb-2 flex-wrap">
          {/* Prev */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Página anterior"
          >
            <Icon icon="ph:caret-left-bold" width="16" />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, idx) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200 border ${
                  currentPage === page
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
                    : 'border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === Math.max(1, totalPages)}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Página siguiente"
          >
            <Icon icon="ph:caret-right-bold" width="16" />
          </button>

          {/* Page info */}
          <span className="ml-2 text-xs text-gray-400 font-medium hidden sm:inline">
            {startIndex + 1}–{Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)} de {products.length}
          </span>
        </div>
      )}
    </div>
  );
}