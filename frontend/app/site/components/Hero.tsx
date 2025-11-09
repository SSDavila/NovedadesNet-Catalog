'use client';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaWhatsapp } from 'react-icons/fa';

export const Hero = () => {
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.section
      className="text-center pt-20 pb-8 md:pt-24 md:pb-12 px-4"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.2 }}
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-yellow-500 text-transparent bg-clip-text"
          variants={itemVariants}
        >
          Descubre lo último en productos novedosos.
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          En Novedades Net, te traemos los artículos más innovadores y sorprendentes del mercado, con la comodidad que mereces.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/site/products" className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300">
            Explorar Catálogo <FaArrowRight />
          </Link>
          <a href="https://wa.me/+593963988846" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 text-gray-900 rounded-full text-lg font-semibold shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-all duration-300">
            <FaWhatsapp size={28} /> Pedido Directo
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};