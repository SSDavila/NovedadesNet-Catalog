'use client';

import { useState } from 'react';
import ProductDetailModal from '../components/ProductDetailModal';
import { getProductImageUrl } from "@/lib/utils";
import { Product } from '@/interfaces/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrls = product.prodImages?.map(getProductImageUrl) || [];
  const cardImageUrl = imageUrls.length > 0 ? imageUrls[0] : '/placeholder.png';

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 overflow-hidden group"
      >
        <div className="relative">
          <img src={cardImageUrl} alt={product.prodName} className="w-full h-56 object-cover bg-gray-200" />
          {product.prodStock === 0 && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              Sin stock
            </span>
          )}
        </div>
        <div className="p-5 flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.prodName}</h3>
          <p className="text-green-600 font-bold text-xl">${Number(product.prodPrice).toFixed(2)}</p>
          <p className="text-gray-500 text-sm line-clamp-2">{product.prodDesc}</p>
        </div>
      </div>

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nombre={product.prodName}
        precio={Number(product.prodPrice)}
        descripcion={product.prodDesc || 'Sin descripción.'}
        imagenes={imageUrls}
      />
    </>
  );
}
