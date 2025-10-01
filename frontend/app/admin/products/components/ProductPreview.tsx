'use client';

import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { FaChevronLeft, FaChevronRight, FaImage, FaWhatsapp } from 'react-icons/fa';

interface ProductPreviewProps {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria: string;
  imagenes: string[];
}

export default function ProductPreview({
  nombre,
  descripcion,
  precio,
  stock,
  categoria,
  imagenes,
}: ProductPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = imagenes.length > 0;

  useEffect(() => {
    // Reset index if images change and current index is out of bounds
    if (hasImages && activeIndex >= imagenes.length) {
      setActiveIndex(0);
    }
  }, [imagenes.length, activeIndex, hasImages]);

  const paginate = (newIndex: number) => {
    if (newIndex < 0) {
      setActiveIndex(imagenes.length - 1);
    } else if (newIndex >= imagenes.length) {
      setActiveIndex(0);
    } else {
      setActiveIndex(newIndex);
    }
  };

  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '593963988846';

  const handleWhatsAppClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const message = `Hola, estoy interesado/a en el producto: ${nombre || 'este producto'}.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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

  const stockNumber = Number(stock) || 0;
  const stockClasses = getStockClasses(stockNumber);

  return (
    <div className="bg-white rounded-xl h-full flex flex-col overflow-hidden border border-gray-200"> 
      <div className="relative flex items-center justify-center w-full h-80 md:h-96 p-4 overflow-hidden bg-white flex-shrink-0 rounded-t-xl">
        {hasImages ? (
          <>
            <AnimatePresence initial={false}>
              {imagenes.map((image, index) => {
                const position = index - activeIndex;
                const isCenter = position === 0;

                return (
                  <motion.img
                    key={image + index}
                    src={image}
                    alt={`${nombre || 'Producto'} - Imagen ${index + 1}`}
                    className="absolute h-full w-full object-contain"
                    initial={{
                      x: `${position * 50}%`,
                      scale: isCenter ? 1 : 0.7,
                      opacity: isCenter ? 1 : 0.5,
                      filter: isCenter ? 'blur(0px)' : 'blur(2px)',
                      zIndex: imagenes.length - Math.abs(position),
                    }}
                    animate={{
                      x: `${position * 50}%`,
                      scale: isCenter ? 1 : 0.7,
                      opacity: isCenter ? 1 : 0.5,
                      filter: isCenter ? 'blur(0px)' : 'blur(2px)',
                      zIndex: imagenes.length - Math.abs(position),
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                );
              })}
            </AnimatePresence>
            {imagenes.length > 1 && (
              <>
                <button type="button" onClick={() => paginate(activeIndex - 1)} className="absolute left-2 z-20 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 transition"> <FaChevronLeft /> </button>
                <button type="button" onClick={() => paginate(activeIndex + 1)} className="absolute right-2 z-20 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 transition"> <FaChevronRight /> </button>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FaImage size={48} />
            <span className="mt-2 font-semibold">Imágenes</span>
          </div>
        )}
      </div>

      <div className="p-6 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-t border-gray-200">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-900 break-words w-full pr-4">
            {nombre || 'Nombre del producto'}
          </h2>
          <div className="text-2xl font-semibold text-green-600 whitespace-nowrap">
            ${precio ? Number(precio).toFixed(2) : '0.00'}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3 text-sm text-gray-900">
          <span><span className="font-semibold">Categoría:</span> <span className="font-normal">{categoria || 'N/A'}</span>
          </span> 
          <span className="text-gray-300">|</span>
          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${stockClasses.bg} ${stockClasses.text}`}>
            <div className={`h-2 w-2 rounded-full ${stockClasses.dot}`}></div>
            {stockNumber > 0 ? `${stockNumber} en Stock` : 'Agotado'}
          </div>
        </div>

        <div className="mt-4 text-gray-600 prose prose-sm max-w-none">
          <p className="whitespace-pre-line">
            {descripcion || 'Aquí aparecerá la descripción detallada del producto.'}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button onClick={handleWhatsAppClick} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold">
            <FaWhatsapp size={20} />
            Pedir por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
