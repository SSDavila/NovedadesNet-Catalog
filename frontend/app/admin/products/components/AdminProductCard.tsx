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
    <div className="group relative bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-soft flex flex-col overflow-hidden transition-all duration-300 hover:shadow-deep hover:-translate-y-1">
      <div className="relative w-full h-36 sm:h-52 overflow-hidden bg-gray-50">
        <Image
          src={imageUrl}
          alt={product.productName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-xl sm:rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gray-900/10 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
          <button onClick={() => onEdit(product)} className="bg-white/95 backdrop-blur-sm text-gray-700 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-md active:scale-95" aria-label="Editar producto">
            <FaEdit size={12} className="sm:w-3.5 sm:h-3.5" />
          </button>
          <button onClick={() => onDelete(product)} className="bg-white/95 backdrop-blur-sm text-gray-700 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-md active:scale-95" aria-label="Eliminar producto">
            <FaTrashAlt size={12} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-5 flex-grow flex flex-col">
        <div className="min-h-[42px] sm:min-h-[56px]">
          {product.category && (
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">
              {product.category.categoryName}
            </p>
          )}
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug group-hover:text-purple-600 transition-colors line-clamp-2">
            {product.productName}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 sm:gap-0 pt-2.5 sm:pt-4 mt-auto border-t border-gray-50">
          <p className={`text-sm sm:text-base font-bold ${hasOffer ? 'text-emerald-600' : 'text-gray-900'}`}>
            ${Number(hasOffer ? product.productOfferPrice : product.productPrice).toFixed(0)}
          </p>
          <div
            className={`self-start sm:self-auto flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-md sm:rounded-lg ${stockClasses.bg} ${stockClasses.text}`}
          >
            <div className={`h-1 w-1 rounded-full ${stockClasses.dot}`}></div>
            <span>{stockClasses.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
