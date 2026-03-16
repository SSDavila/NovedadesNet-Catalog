'use client';
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaTags, FaWhatsapp, FaHandshake } from 'react-icons/fa';
import { ProductCard } from './ProductCard';
import { GradientTitle } from './GradientTitle';

interface ProductCarouselProps {
  products: {
    name: string;
    image: string;
    category: string;
    price: number;
    offerPrice?: number | null;
    href: string;
  }[];
  title: string;
  subtitle: string;
}

export const ProductCarousel = ({ products, title, subtitle }: ProductCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const visibleProducts = 3;
  const productList = products.slice(0, 12);
  const totalProducts = productList.length;

  if (totalProducts === 0) {
    return null; // No renderizar nada si no hay productos
  }

  const paginate = (newDirection: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(newDirection);
    setIndex((prevIndex) => (prevIndex + (newDirection * visibleProducts) + totalProducts) % totalProducts);
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="w-full">
      <div className="flex justify-between items-center mb-10">
        <motion.div variants={itemVariants}>
          <GradientTitle icon={<FaTags />} text={title} gradientId="tags-gradient" />
          <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
        </motion.div>
        <div className="hidden lg:flex gap-3">
          <button onClick={() => paginate(-1)} aria-label="Anterior" className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-purple-100 transition-all duration-300"><FaArrowLeft className="text-purple-600" /></button>
          <button onClick={() => paginate(1)} aria-label="Siguiente" className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-purple-100 transition-all duration-300"><FaArrowRight className="text-purple-600" /></button>
        </div>
      </div>

      <div className="relative h-[400px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            onAnimationComplete={() => setIsAnimating(false)}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(visibleProducts)].map((_, i) => {
              const productIndex = (index + i) % totalProducts;
              const product = productList[productIndex];
              // Clave única que considera la página actual del carrusel (index) y la posición de la tarjeta (i)
              const uniqueKey = `${index}-${i}-${product?.href || productIndex}`;

              return <ProductCard key={uniqueKey} product={product} />;
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Wholesale / B2B Banner (Light Ultra-Premium Theme) */}
      <motion.div variants={itemVariants} className="mt-8 relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-[1.5rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/60 group/b2b transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(168,85,247,0.12)]">
        {/* Background Accents (Light) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-overlay z-0 pointer-events-none"></div>
        <FaHandshake className="absolute -bottom-20 -right-10 text-[280px] text-purple-600/5 group-hover/b2b:text-purple-600/10 group-hover/b2b:scale-110 group-hover/b2b:-rotate-12 transition-all duration-700 pointer-events-none z-0" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
            ¿Compras al <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-yellow-500">Por Mayor?</span>
          </h4>
          <p className="mt-2 text-sm md:text-[15px] font-medium text-slate-600 max-w-lg">
            Abastece tu negocio con nuestro catálogo premium. Ofrecemos precios especiales, atención personalizada y envíos prioritarios para mayoristas.
          </p>
        </div>

        {/* Action Button */}
        <div className="relative z-10 shrink-0 mt-2 md:mt-0">
          <a 
            href="https://wa.me/593999999999?text=Hola,%20me%20interesa%20información%20sobre%20ventas%20al%20por%20mayor." 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl text-[15px] font-bold shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.5)] hover:-translate-y-1 hover:bg-[#22bf5b] transition-all duration-300 group/wa"
          >
            <FaWhatsapp size={22} className="text-white group-hover/wa:scale-110 transition-transform" />
            Contactar Asesor
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};