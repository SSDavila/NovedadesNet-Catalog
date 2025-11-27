'use client';

import Image from 'next/image';
import { Product } from '@/interfaces';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

interface AdminProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const AdminProductCard = ({ product, onEdit, onDelete }: AdminProductCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStockClasses = (stock: number) => {
    if (stock === 0) {
      return {
        dot: 'bg-red-600',
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Agotado',
      };
    }
    if (stock <= 2) {
      return {
        dot: 'bg-orange-600',
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        label: `${stock} en Stock`,
      };
    }
    if (stock <= 5) {
      return {
        dot: 'bg-yellow-600',
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: `${stock} en Stock`,
      };
    }
    return { 
      dot: 'bg-green-600',
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: `${stock} en Stock`,
    };
  };

  const imageUrl = product.images?.[0]?.productImageUrl ?? '/placeholder.svg';
  const hasOffer = product.productOfferPrice > 0;
  const stockClasses = getStockClasses(product.productStock);

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.productName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={() => onEdit(product)} className="bg-white/80 text-gray-900 p-3 rounded-full hover:bg-white transition" aria-label="Editar producto">
            <FaEdit size={20} />
          </button>
          <button onClick={() => onDelete(product)} className="bg-white/80 text-red-600 p-3 rounded-full hover:bg-white transition" aria-label="Eliminar producto">
            <FaTrashAlt size={20} />
          </button>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="min-h-[60px]">
          {product.category && (
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wider mb-1">
              {product.category.categoryName}
            </p>
          )}
          <h3 className="text-lg font-semibold text-gray-800 truncate flex-grow leading-tight">
            {product.productName}
          </h3>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-baseline gap-2">
            <p className={`font-semibold ${hasOffer ? 'text-green-600 text-lg' : 'text-gray-900 text-lg'}`}>
              {formatCurrency(hasOffer ? product.productOfferPrice : product.productPrice)}
            </p>
            {hasOffer && (
              <p className="text-sm text-gray-500 line-through">
                {formatCurrency(product.productPrice)}
              </p>
            )}
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold rounded-full ${stockClasses.bg} ${stockClasses.text} ${product.productStock === 0 ? 'animate-pulse' : ''}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${stockClasses.dot}`}></span>
            {stockClasses.label}
          </span>
        </div>
      </div>
    </div>
  );
};