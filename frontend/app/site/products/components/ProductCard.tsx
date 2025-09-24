'use client';
import { useState } from 'react';
import ProductDetailModal from './ProductDetailModal';
import { Product } from '@/interfaces/product';
import { getProductImageUrl } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const imageUrl = product.prodImages.length > 0 ? getProductImageUrl(product.prodImages[0]) : '/placeholder.png';

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <img
          src={imageUrl}
          alt={product.prodName}
          className="w-full h-64 object-cover bg-gray-200"
        />
        <div className="p-4 flex flex-col gap-2">
          <h2 className="font-semibold text-lg text-gray-900">{product.prodName}</h2>
          <p className="text-blue-600 font-bold text-xl">${Number(product.prodPrice).toFixed(2)}</p>
          <p className="text-gray-500 text-sm">{product.prodCategory}</p>
        </div>
      </div>

      <ProductDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
      />
    </>
  );
}
