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
    <div className="group relative bg-white/70 backdrop-blur-md border border-white/20 rounded-[2rem] shadow-sm flex flex-col overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)] hover:-translate-y-1">
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.productName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <button onClick={() => onEdit(product)} className="bg-white text-purple-600 p-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110 shadow-xl" aria-label="Editar producto">
            <FaEdit size={18} />
          </button>
          <button onClick={() => onDelete(product)} className="bg-white text-rose-600 p-4 rounded-2xl hover:bg-rose-600 hover:text-white transition-all transform hover:scale-110 shadow-xl" aria-label="Eliminar producto">
            <FaTrashAlt size={18} />
          </button>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="min-h-[70px]">
          {product.category && (
            <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-2">
              {product.category.categoryName}
            </p>
          )}
          <h3 className="text-xl font-black text-gray-900 leading-tight tracking-tighter">
            {product.productName}
          </h3>
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-gray-50 mt-auto">
          <div className="flex items-baseline gap-2">
            <p className={`font-black tracking-tighter ${hasOffer ? 'text-emerald-600 text-2xl' : 'text-gray-900 text-2xl'}`}>
              ${Number(hasOffer ? product.productOfferPrice : product.productPrice).toFixed(0)}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${stockClasses.bg} ${stockClasses.text} ${product.productStock === 0 ? 'animate-pulse' : ''}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${stockClasses.dot}`}></span>
            {stockClasses.label}
          </span>
        </div>
      </div>
    </div>
  );
};
