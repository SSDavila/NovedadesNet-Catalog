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
      className="text-center pt-12 pb-6 md:pt-16 md:pb-10 px-4"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.2 }}
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h1
          className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]"
          variants={itemVariants}
        >
          Descubre lo último en <span className="bg-gradient-to-r from-purple-600 to-yellow-500 text-transparent bg-clip-text">innovación.</span>
        </motion.h1>

        <motion.p
          className="mt-8 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
          variants={itemVariants}
        >
          En <span className="font-bold text-slate-800">Novedades Net</span> te traemos los artículos más sorprendentes del mercado, combinando tecnología y estilo con la comodidad que mereces.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link href="/site/products" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-purple-600 text-white rounded-2xl text-lg font-bold shadow-[0_8px_30px_rgb(147,51,234,0.3)] hover:shadow-[0_8px_40px_rgb(147,51,234,0.5)] hover:-translate-y-1 hover:bg-purple-700 transition-all duration-300">
            Explorar Catálogo <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="https://wa.me/+593963988846" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto relative group inline-flex items-center justify-center gap-4 px-8 py-4 bg-[#25D366] text-white rounded-2xl text-[19px] font-bold shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgb(37,211,102,0.6)] hover:-translate-y-1 hover:bg-[#20bd5a] transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
            <div className="absolute -inset-1 bg-[#25D366] opacity-30 rounded-2xl blur-lg group-hover:opacity-60 transition-opacity duration-300"></div>
            <FaWhatsapp className="text-white relative z-10 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300 drop-shadow-md" size={32} />
             <span className="relative z-10 drop-shadow-sm">Pedido Directo</span>
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};