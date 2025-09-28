'use client';
import { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Product } from '@/interfaces/product';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
}: ProductDetailModalProps) {
  if (!isOpen) return null;

  const [activeIndex, setActiveIndex] = useState(0);

  const imageUrls = product.prodImages.map(image => image.prodImageUrl);
  const hasImages = imageUrls && imageUrls.length > 0;

  const displayImages = hasImages ? imageUrls : ['/placeholder.png'];

  const paginate = (newIndex: number) => {
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl max-w-3xl w-full animate-fadeIn max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition z-30"
        >
          <FaTimes />
        </button>

        <div className="relative flex items-center justify-center w-full h-64 md:h-80 p-6 overflow-hidden">
          <AnimatePresence>
            {displayImages.map((image, index) => {
              const position = index - activeIndex;
              const isCenter = position === 0;

              return (
                <motion.img
                  key={image + index}
                  src={image}
                  alt={`${product.prodName} - Image ${index + 1}`}
                  className="absolute h-full w-full object-contain cursor-grab active:cursor-grabbing will-change-transform"
                  initial={{
                    x: `${position * 40}%`,
                    scale: isCenter ? 1 : 0.6,
                    opacity: isCenter ? 1 : 0.4,
                    filter: isCenter ? 'blur(0px)' : 'blur(4px)',
                    zIndex: displayImages.length - Math.abs(position),
                  }}
                  animate={{
                    x: `${position * 40}%`,
                    scale: isCenter ? 1 : 0.6,
                    opacity: isCenter ? 1 : 0.4,
                    filter: isCenter ? 'blur(0px)' : 'blur(4px)',
                    zIndex: displayImages.length - Math.abs(position),
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset }) => {
                    if (offset.x > 100 && activeIndex > 0) {
                      paginate(activeIndex - 1);
                    } else if (offset.x < -100 && activeIndex < displayImages.length - 1) {
                      paginate(activeIndex + 1);
                    }
                  }}
                />
              );
            })}
          </AnimatePresence>
          {displayImages.length > 1 && (
            <>
              <button onClick={() => paginate(activeIndex - 1)} disabled={activeIndex === 0} className="absolute left-4 z-20 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 transition disabled:opacity-30 disabled:cursor-not-allowed"> <FaChevronLeft /> </button>
              <button onClick={() => paginate(activeIndex + 1)} disabled={activeIndex === displayImages.length - 1} className="absolute right-4 z-20 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 transition disabled:opacity-30 disabled:cursor-not-allowed"> <FaChevronRight /> </button>
            </>
          )}
        </div>

        <div className="p-6 md:p-8 pt-0 overflow-y-auto">
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-gray-900">{product.prodName}</h2>
            <p className="text-2xl font-semibold text-blue-600 mt-2">${Number(product.prodPrice).toFixed(2)}</p>
            <div className="mt-4 text-gray-600 prose max-w-none">
              <p>{product.prodDescription || 'Este producto no tiene una descripción detallada.'}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-right">
            <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
