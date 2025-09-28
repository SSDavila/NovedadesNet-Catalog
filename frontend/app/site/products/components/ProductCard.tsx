'use client';
import { useState } from 'react';
import { FaExpand } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import ProductDetailModal from './ProductDetailModal';
import { Product } from '@/interfaces/product';

export default function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);

  const imageUrl = product.prodImages?.[0]?.prodImageUrl || '/placeholder.png';

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
            <div className="text-gray-900">
              <span className="text-lg font-bold">${Math.trunc(product.prodPrice)}</span>
              <span className="text-sm font-semibold">.{(product.prodPrice % 1).toFixed(2).substring(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  product.prodStock === 0
                    ? 'bg-red-500'
                    : product.prodStock < 10
                    ? 'bg-yellow-400'
                    : 'bg-green-500'
                }`}
              ></div>
              <span className="text-xs font-semibold text-gray-600">
                {product.prodStock > 0 ? `${product.prodStock} en Stock` : 'Agotado'}
              </span>
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
