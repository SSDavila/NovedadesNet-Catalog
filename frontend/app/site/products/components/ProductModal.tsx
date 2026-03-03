'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/interfaces/index';
import { FaTimes, FaWhatsapp, FaBox, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { backdropVariants, modalVariants } from '@/app/animations/modalVariants';
import clsx from 'clsx';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [userSelectedImage, setUserSelectedImage] = useState<string | null>(null);

  const getStockColors = useCallback((stock: number) => {
    if (stock > 5) {
      return { dot: 'bg-green-500', container: 'bg-green-100', text: 'text-green-800' };
    }
    if (stock >= 3) {
      return { dot: 'bg-yellow-500', container: 'bg-yellow-100', text: 'text-yellow-800' };
    }
    if (stock >= 1) {
      return { dot: 'bg-orange-500', container: 'bg-orange-100', text: 'text-orange-800' };
    }
    return { dot: 'bg-red-500', container: 'bg-red-100', text: 'text-red-800' };
  }, []);

  const primaryImageUrl = useMemo(() => product?.images?.[0]?.productImageUrl || '/placeholder.svg', [product]);
  const selectedImage = useMemo(() => userSelectedImage || primaryImageUrl, [userSelectedImage, primaryImageUrl]);

  useEffect(() => {
    setUserSelectedImage(null);
  }, [product]);

  const handleWhatsAppClick = useCallback(() => {
    const phoneNumber = '593963988846';
    const message = `¡Hola! Estoy interesado/a en el producto: ${product?.productName}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, [product?.productName]);

  const stockColors = getStockColors(product?.productStock || 0);

  const images = useMemo(() => product?.images || [], [product]);
  const currentIndex = useMemo(() => {
    if (!selectedImage) return 0;
    const index = images.findIndex(img => img.productImageUrl === selectedImage);
    return index >= 0 ? index : 0;
  }, [images, selectedImage]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setUserSelectedImage(images[newIndex].productImageUrl);
  }, [images, currentIndex]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex = (currentIndex + 1) % images.length;
    setUserSelectedImage(images[newIndex].productImageUrl);
  }, [images, currentIndex]);

  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailsRef.current) {
      const scrollAmount = 200;
      thumbnailsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Sync thumbnail scroll with current image
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        const container = thumbnailsRef.current;
        const scrollLeft = activeThumb.offsetLeft - (container.offsetWidth / 2) + (activeThumb.offsetWidth / 2);
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex justify-center items-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-[2rem] shadow-deep w-full max-w-5xl h-fit max-h-[85vh] overflow-hidden flex flex-col md:flex-row relative"
            variants={modalVariants}
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Floating & Top-Right */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-30 p-2 rounded-xl bg-gray-100/50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all backdrop-blur-sm"
            >
              <FaTimes size={18} />
            </button>

            {/* Left Column: Images Area */}
            <div className="w-full md:w-[50%] p-6 md:p-8 shrink-0 bg-gray-50/50 flex flex-col items-center justify-center md:min-h-[600px] overflow-hidden">
              <div className="w-full flex flex-col gap-6 mx-auto">
                <div className="group/main relative aspect-square w-full md:max-h-[55vh] rounded-2xl overflow-hidden shadow-deep border border-gray-100 bg-white shrink-0">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={selectedImage}
                    alt={product.productName}
                    className="w-full h-full object-contain"
                  />

                  {/* Navigation Arrows - Main Image */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 border border-gray-100 rounded-full bg-white/95 text-gray-900 shadow-xl transition-all active:scale-90 z-10"
                        aria-label="Imagen anterior"
                      >
                        <FaChevronLeft size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 border border-gray-100 rounded-full bg-white/95 text-gray-900 shadow-xl transition-all active:scale-90 z-10"
                        aria-label="Siguiente imagen"
                      >
                        <FaChevronRight size={14} />
                      </button>

                      {/* Image Counter Overlay */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-black tracking-widest z-10">
                        {currentIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails Row with Manual Controls */}
                {images.length > 1 && (
                  <div className="relative group/thumbs w-full px-1">
                    <div className="flex items-center gap-2">
                      {/* Left Control */}
                      <button
                        onClick={() => scrollThumbnails('left')}
                        className="p-2 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-purple-600 shadow-sm transition-all hover:shadow-md hidden md:block shrink-0"
                      >
                        <FaChevronLeft size={10} />
                      </button>

                      {/* Carousel Container */}
                      <div
                        ref={thumbnailsRef}
                        className="flex-grow flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar-thin scroll-smooth snap-x items-center px-1"
                      >
                        {images.map((image) => (
                          <div
                            key={image.productImageId}
                            className={clsx(
                              "aspect-square w-16 shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-0.5 bg-white snap-center",
                              selectedImage === image.productImageUrl ? 'border-purple-600 shadow-md scale-105 z-10' : 'border-gray-100 hover:border-purple-200'
                            )}
                            onClick={() => setUserSelectedImage(image.productImageUrl)}
                          >
                            <img src={image.productImageUrl} alt="" className="w-full h-full object-cover rounded-[0.5rem]" />
                          </div>
                        ))}
                      </div>

                      {/* Right Control */}
                      <button
                        onClick={() => scrollThumbnails('right')}
                        className="p-2 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-purple-600 shadow-sm transition-all hover:shadow-md hidden md:block shrink-0"
                      >
                        <FaChevronRight size={10} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Progress Dots Indicator */}
                {images.length > 1 && (
                  <div className="flex justify-center gap-1.5 pt-1">
                    {images.map((_, idx) => (
                      <div
                        key={idx}
                        className={clsx(
                          "h-1 transition-all duration-300 rounded-full",
                          currentIndex === idx ? "w-6 bg-purple-600" : "w-1.5 bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Content (Scrollable) */}
            <div className="w-full md:w-[50%] p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="space-y-6 flex-grow">
                <div>
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">
                    {product.category?.categoryName}
                  </p>
                  <h2 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter leading-tight">
                    {product.productName}
                  </h2>
                </div>

                <div className="flex flex-col gap-2">
                  {product.productOfferPrice && parseFloat(product.productOfferPrice as any) > 0 && parseFloat(product.productOfferPrice as any) < parseFloat(product.productPrice as any) ? (
                    <div className="flex items-baseline gap-4">
                      <p className="text-4xl font-black text-gray-900 tracking-tighter">
                        {formatPrice(parseFloat(product.productOfferPrice as any))}
                      </p>
                      <p className="text-xl text-gray-400 line-through font-medium">
                        {formatPrice(parseFloat(product.productPrice as any))}
                      </p>
                    </div>
                  ) : (
                    <p className="text-4xl font-black text-gray-900 tracking-tighter">
                      {formatPrice(parseFloat(product.productPrice as any))}
                    </p>
                  )}

                  <div className="pt-2">
                    <span className={clsx(
                      "inline-flex items-center px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full",
                      stockColors.container, stockColors.text
                    )}>
                      <div className={clsx("w-1.5 h-1.5 rounded-full mr-2", stockColors.dot)}></div>
                      {product.productStock > 0 ? `${product.productStock} en stock` : 'Agotado'}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Descripción</h4>
                  <div className="text-gray-600 text-base leading-relaxed prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap font-medium">{product.productDescription}</p>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center bg-emerald-500 text-white font-black py-4 px-8 rounded-2xl hover:bg-emerald-600 transition-all duration-300 shadow-lg shadow-emerald-500/20 group active:scale-[0.98]"
                >
                  <FaWhatsapp size={24} className="mr-3 group-hover:rotate-12 transition-transform" />
                  PEDIR POR WHATSAPP
                </button>
                <p className="text-center text-gray-400 text-[10px] font-bold mt-4 uppercase tracking-widest">
                  Envío a domicilio en todo el país
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}