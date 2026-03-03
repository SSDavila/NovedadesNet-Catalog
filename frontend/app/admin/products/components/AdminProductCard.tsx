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
    <div className="group relative bg-white border border-gray-100 rounded-2xl shadow-soft flex flex-col overflow-hidden transition-all duration-300 hover:shadow-deep hover:-translate-y-1">
      <div className="relative w-full h-52 overflow-hidden bg-gray-50">
        <Image
          src={imageUrl}
          alt={product.productName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button onClick={() => onEdit(product)} className="bg-white text-gray-700 p-2.5 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-lg" aria-label="Editar producto">
            <FaEdit size={14} />
          </button>
          <button onClick={() => onDelete(product)} className="bg-white text-gray-700 p-2.5 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-lg" aria-label="Eliminar producto">
            <FaTrashAlt size={14} />
          </button>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <div className="min-h-[60px]">
          {product.category && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              {product.category.categoryName}
            </p>
          )}
          <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-purple-600 transition-colors">
            {product.productName}
          </h3>
        </div>
        <div className="flex justify-between items-center pt-4 mt-auto border-t border-gray-50">
          <p className={`text-base font-bold ${hasOffer ? 'text-emerald-600' : 'text-gray-900'}`}>
            ${Number(hasOffer ? product.productOfferPrice : product.productPrice).toFixed(0)}
          </p>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg ${stockClasses.bg} ${stockClasses.text}`}
          >
            <div className={`h-1 w-1 rounded-full ${stockClasses.dot}`}></div>
            {stockClasses.label}
          </div>
        </div>
      </div>
    </div>
  );
};
