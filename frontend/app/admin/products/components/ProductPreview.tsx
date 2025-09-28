'use client';

import { useState, useEffect, MouseEvent } from 'react';
import { FaChevronLeft, FaChevronRight, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductPreviewProps {
  nombre: string;
  precio: number;
  descripcion: string | null;
  imagenes: string[];
}

export default function ProductPreview({
  nombre,
  descripcion,
  precio,
  imagenes,
}: ProductPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '593963988846';

  const hasImages = imagenes && imagenes.length > 0;
  const displayImages = hasImages ? imagenes : ['/placeholder.png'];

  useEffect(() => {
    setActiveIndex(0);
  }, [imagenes]);

  const paginate = (newIndex: number) => {
    if (newIndex < 0) {
      setActiveIndex(displayImages.length - 1);
    } else if (newIndex >= displayImages.length) {
      setActiveIndex(0);
    } else {
      setActiveIndex(newIndex);
    }
  };

  const handleWhatsAppClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const message = `Hola, estoy interesado/a en el producto: ${nombre}.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full h-full flex flex-col">
      <div className="relative flex items-center justify-center w-full h-64 md:h-80 p-6 py-4 overflow-hidden">
        <AnimatePresence>
          {displayImages.map((image, index) => {
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
                  zIndex: displayImages.length - Math.abs(position),
                }}
                animate={{
                  x: `${position * 50}%`,
                  scale: isCenter ? 1 : 0.7,
                  opacity: isCenter ? 1 : 0.5,
                  zIndex: displayImages.length - Math.abs(position),
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{nombre || 'Nombre del Producto'}</h2>
          <p className="text-2xl font-semibold text-green-600 mt-2">${(precio || 0).toFixed(2)}</p>
          <div className="mt-4 text-gray-600 prose max-w-none">
            <p>{descripcion || 'Descripción detallada del producto.'}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex justify-end items-center gap-4">
          <button onClick={handleWhatsAppClick} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold">
            <FaWhatsapp size={20} />
            Pedir por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}