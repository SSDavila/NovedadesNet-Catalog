'use client';

import { motion } from 'framer-motion';
import { Product } from '@/interfaces';
import clsx from 'clsx';
import { FaTag, FaBoxOpen, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Icon } from '@iconify/react';

interface AdminProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onCardClick?: (product: Product) => void;
}

export const AdminProductCard = ({
  product,
  onEdit,
  onDelete,
  onCardClick,
}: AdminProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockStatus = () => {
    const stock = product.productStock;
    if (stock > 5) return {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-100',
      label: 'En Stock'
    };
    if (stock > 0) return {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-100',
      label: 'En Stock'
    };
    return {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-100',
      label: 'Agotado'
    };
  };

  const stockStatus = getStockStatus();
  const hasOffer = product.productOfferPrice &&
    parseFloat(product.productOfferPrice as any) > 0 &&
    parseFloat(product.productOfferPrice as any) < parseFloat(product.productPrice as any);

  return (
    <motion.div
      className="group relative flex flex-col h-full bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={() => onCardClick?.(product)}
    >
      {/* Image Container - Aspect 4/3 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <motion.img
          src={product.images?.[0]?.productImageUrl || '/placeholder.svg'}
          alt={product.productName}
          className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Overlay Badges - Offer Badge */}
        {hasOffer && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 pointer-events-none z-10">
            <div className="bg-yellow-400 text-gray-900 text-[10px] font-black px-2.5 sm:px-3 py-1 rounded-full shadow-lg flex items-center tracking-widest uppercase border border-yellow-500/20">
              <FaTag size={8} className="mr-1.5" />
              Oferta
            </div>
          </div>
        )}

        {/* Action Buttons: Edit & Delete with stopPropagation */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1.5 sm:gap-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-md active:scale-95 border border-gray-100"
            title="Editar producto"
            aria-label="Editar producto"
          >
            <FaEdit size={11} className="sm:w-3.5 sm:h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-md active:scale-95 border border-gray-100"
            title="Eliminar producto"
            aria-label="Eliminar producto"
          >
            <FaTrashAlt size={11} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 pb-3 sm:pb-4 flex flex-col flex-grow bg-white">
        <div className="flex justify-between items-center gap-1.5 sm:gap-4 mb-2 sm:mb-3 min-w-0">
          <div className="flex flex-col flex-1 min-w-0">
            <p
              className="text-[9px] sm:text-[11px] font-black text-purple-600 uppercase tracking-[0.12em] sm:tracking-[0.2em] mb-1 truncate"
              title={product.category?.categoryName || 'General'}
            >
              {product.category?.categoryName || 'General'}
            </p>
          </div>

          {/* Enhanced Stock Badge */}
          <div className={clsx(
            "flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm border whitespace-nowrap shrink-0",
            stockStatus.bg,
            stockStatus.text,
            stockStatus.border
          )}>
            <FaBoxOpen size={10} />
            <span>{product.productStock} {stockStatus.label}</span>
          </div>
        </div>

        {/* Title area */}
        <div className="mb-2">
          <h3 className="text-xs sm:text-base font-bold text-gray-900 leading-snug group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.productName}
          </h3>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-50">
          <div className="flex flex-col">
            {hasOffer ? (
              <div className="flex flex-col">
                <p className="text-base sm:text-2xl font-black text-gray-900 tracking-tighter leading-none">
                  {formatPrice(parseFloat(product.productOfferPrice as any))}
                </p>
                <p className="text-[10px] sm:text-sm text-gray-400 line-through font-medium mt-0.5 sm:mt-1">
                  {formatPrice(parseFloat(product.productPrice as any))}
                </p>
              </div>
            ) : (
              <p className="text-base sm:text-2xl font-black text-gray-900 tracking-tighter leading-none">
                {formatPrice(parseFloat(product.productPrice as any))}
              </p>
            )}
          </div>

          <div
            className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100/50 flex-shrink-0"
            title="Ver detalles"
          >
            <Icon icon="ph:arrow-right-bold" width="18" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
