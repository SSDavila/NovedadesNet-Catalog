'use client';
import { useState } from 'react';
import { FaExpand } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import ProductDetailModal from './ProductDetailModal';
import { Product } from '@/interfaces/product';

export default function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);

  const imageUrl = product.prodImages?.[0]?.prodImageUrl || '/placeholder.png';

  const getStockClasses = (stock: number) => {
    if (stock > 5) {
      return {
        dot: 'bg-green-500',
        bg: 'bg-green-100',
        text: 'text-green-800',
      };
    }
    if (stock >= 3) {
      return {
        dot: 'bg-yellow-500',
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
      };
    }
    if (stock >= 1) {
      return {
        dot: 'bg-orange-500',
        bg: 'bg-orange-100',
        text: 'text-orange-800',
      };
    }
    return { dot: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-800' };
  };

  return (
    <>
      <div
        className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <div className="relative h-60 w-full overflow-hidden bg-gray-200">
          <img
            src={imageUrl}
            alt={product.prodName}
            className="h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="p-2 bg-white/80 rounded-full text-gray-800 backdrop-blur-sm">
              <FaExpand size={20} />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="text-base font-bold text-gray-800 truncate" title={product.prodName}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.prodName}
            </h3>
            <p className="mt-1 text-xs font-medium text-gray-500">{product.prodCategory}</p>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-green-600">
              <span className="text-lg font-bold">${Math.trunc(product.prodPrice)}</span>
              <span className="text-sm font-semibold">.{(product.prodPrice % 1).toFixed(2).substring(2)}</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${getStockClasses(product.prodStock).bg} ${getStockClasses(product.prodStock).text}`}>
              <div className={`h-2 w-2 rounded-full ${getStockClasses(product.prodStock).dot}`}></div>
                {product.prodStock > 0 ? `${product.prodStock} en Stock` : 'Agotado'}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <ProductDetailModal
            onClose={() => setModalOpen(false)}
            product={product}
          />
        )}
      </AnimatePresence>
    </>
  );
}
