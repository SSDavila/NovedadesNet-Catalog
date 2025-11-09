'use client';
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaTags } from 'react-icons/fa';
import { ProductCard } from './ProductCard';
import { GradientTitle } from './GradientTitle';

interface ProductCarouselProps {
  products: {
    name: string;
    image: string;
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

  const visibleProducts = 3;
  const productList = products.slice(0, 9); 
  const totalProducts = productList.length;

  if (totalProducts === 0) {
    return null; // No renderizar nada si no hay productos
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prevIndex) => (prevIndex + (newDirection * visibleProducts) + totalProducts) % totalProducts);
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };
  
  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
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

      <div className="relative h-[450px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(visibleProducts)].map((_, i) => {
              const productIndex = (index + i) % totalProducts;
              const product = productList[productIndex];
              // Usar una clave más robusta y única
              const uniqueKey = `${productIndex}-${product?.href || i}`;

              return <ProductCard key={uniqueKey} product={product} />;
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};