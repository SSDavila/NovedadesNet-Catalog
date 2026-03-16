import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { FaTag, FaBoxOpen } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

interface ProductCardProps {
  product: {
    name: string;
    image: string;
    category?: string;
    price: number;
    offerPrice?: number | null;
    stock?: number;
    href: string;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const featureVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockStatus = () => {
    const stock = product.stock || 0;
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

  if (!product) return null;

  const stockStatus = getStockStatus();
  const hasOffer = product.offerPrice && product.offerPrice > 0 && product.offerPrice < product.price;

  return (
    <motion.div
      variants={featureVariants}
      className="group relative flex flex-col h-full bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 border border-gray-100"
    >
      <Link href={product.href} className="flex-grow flex flex-col">
        {/* Image Container - Aspect Ratio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 border-b border-gray-50">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Overlay Badges - Offer Badge */}
          <div className="absolute top-3 left-3 pointer-events-none">
            {hasOffer && (
              <div className="bg-yellow-400 text-gray-900 text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center tracking-widest uppercase border border-yellow-500/20">
                <FaTag size={8} className="mr-1.5" />
                Oferta
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pb-4 flex flex-col flex-grow bg-white">
          <div className="flex justify-between items-center gap-4 mb-3">
            <div className="flex flex-col flex-1">
              <p className="text-[11px] font-black text-purple-600 uppercase tracking-[0.2em] mb-1">
                {product.category || 'General'}
              </p>
            </div>

            {/* Enhanced Stock Badge */}
            <div className={clsx(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border whitespace-nowrap",
              stockStatus.bg,
              stockStatus.text,
              stockStatus.border
            )}>
              <FaBoxOpen size={10} />
              <span>{product.stock || 0} {stockStatus.label}</span>
            </div>
          </div>

          {/* Title area */}
          <div className="mb-2">
            <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
            <div className="flex flex-col">
              {hasOffer ? (
                <div className="flex flex-col">
                  <p className="text-2xl font-black text-gray-900 tracking-tighter leading-none">
                    {formatPrice(product.offerPrice!)}
                  </p>
                  <p className="text-sm text-gray-400 line-through font-medium mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-black text-gray-900 tracking-tighter leading-none">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>

            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm border border-gray-100/50">
              <Icon icon="ph:arrow-right-bold" width="18" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};