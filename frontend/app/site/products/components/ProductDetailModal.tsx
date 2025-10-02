'use client';
import { useState, useEffect, MouseEvent } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaWhatsapp, FaImage } from 'react-icons/fa';
import { Product } from '@/interfaces/product';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailModalProps {
  onClose: () => void;
  product: Product;
  isOpen: boolean;
}

export default function ProductDetailModal({
  onClose,
  product,
  isOpen,
}: ProductDetailModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '593963988846';

  const displayImages = product.prodImages || [];
  const hasImages = displayImages.length > 0;

  const paginate = (newIndex: number) => {
    if (newIndex < 0) {
      setActiveIndex(displayImages.length - 1);
    } else if (newIndex >= displayImages.length) {
      setActiveIndex(0);
    } else {
      setActiveIndex(newIndex);
    }
  };

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

  const stockNumber = Number(product.prodStock) || 0;
  const stockClasses = getStockClasses(stockNumber);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
    }
  }, [isOpen]);

  const handleWhatsAppClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const message = `Hola, estoy interesado/a en el producto: ${product.prodName}.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
      />

      <div className="relative z-10 bg-white rounded-2xl shadow-xl max-w-2xl w-full animate-fadeIn max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition z-30 p-2 rounded-full hover:bg-gray-100"
        >
          <FaTimes />
        </button>
        
        <div className="relative flex items-center justify-center w-full h-80 md:h-96 p-4 overflow-hidden bg-white flex-shrink-0 rounded-t-2xl">
          {hasImages ? (
            <>
              <AnimatePresence initial={false} custom={activeIndex}>
                {displayImages.map((image, index) => {
                  const position = index - activeIndex;
                  const isCenter = position === 0;

                  return (
                    <motion.img
                      key={image.prodImageId} // <-- CORRECCIÓN: Usar el ID único de la imagen
                      src={image.prodImageUrl}
                      alt={`${product.prodName} - Image ${index + 1}`}
                      className="absolute h-full w-full object-contain cursor-grab active:cursor-grabbing"
                      initial={{ x: `${position * 50}%`, scale: isCenter ? 1 : 0.7, opacity: isCenter ? 1 : 0.5, filter: isCenter ? 'blur(0px)' : 'blur(2px)', zIndex: displayImages.length - Math.abs(position) }}
                      animate={{ x: `${position * 50}%`, scale: isCenter ? 1 : 0.7, opacity: isCenter ? 1 : 0.5, filter: isCenter ? 'blur(0px)' : 'blur(2px)', zIndex: displayImages.length - Math.abs(position) }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_e, { offset }) => {
                        if (offset.x > 100) paginate(activeIndex - 1);
                        else if (offset.x < -100) paginate(activeIndex + 1);
                      }}
                    />
                  );
                })}
              </AnimatePresence>
              {displayImages.length > 1 && (
                <>
                  <button type="button" onClick={() => paginate(activeIndex - 1)} className="absolute left-2 z-20 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 transition"> <FaChevronLeft /> </button>
                  <button type="button" onClick={() => paginate(activeIndex + 1)} className="absolute right-2 z-20 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 transition"> <FaChevronRight /> </button>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <FaImage size={48} />
              <span className="mt-2 font-semibold">Sin Imágenes</span>
            </div>
          )}
        </div>

        <div className="p-6 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-t border-gray-200">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 break-words w-full pr-4">
              {product.prodName}
            </h2>
            <div className="text-2xl font-semibold text-green-600 whitespace-nowrap">
              ${Number(product.prodPrice).toFixed(2)}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3 text-sm text-gray-900">
            <span><span className="font-semibold">Categoría:</span> <span className="font-normal">{product.prodCategory || 'N/A'}</span></span>
            <span className="text-gray-300">|</span>
            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${stockClasses.bg} ${stockClasses.text}`}>
              <div className={`h-2 w-2 rounded-full ${stockClasses.dot}`}></div>
              {stockNumber > 0 ? `${stockNumber} en Stock` : 'Agotado'}
            </div>
          </div>

          <div className="mt-4 text-gray-600 prose prose-sm max-w-none flex-grow">
              <p className="whitespace-pre-line">
                {product.prodDescription || 'Este producto no tiene una descripción detallada.'}
              </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex-grow">
              <button onClick={handleWhatsAppClick} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold">
                <FaWhatsapp size={20} />
                Pedir por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
