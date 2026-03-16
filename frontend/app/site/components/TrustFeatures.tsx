'use client';
import { FaBoxOpen, FaShippingFast, FaHandHoldingUsd } from 'react-icons/fa';
import { motion, Variants } from 'framer-motion';

export const TrustFeatures = () => {
  const featureVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
  };

  return (
    <section className="py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Curación Exclusiva */}
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={featureVariants} className="group relative p-8 md:p-10 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] rounded-tr-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(168,85,247,0.15)] hover:-translate-y-2 transition-all duration-500 border border-white/80 overflow-hidden text-left flex flex-col justify-between min-h-[320px]">
            {/* Giant Watermark Background Icon */}
            <FaBoxOpen className="absolute -bottom-10 -right-10 text-[200px] text-purple-600/5 group-hover:text-purple-600/10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none" />

            {/* Top Glow Bar on Hover */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-full"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-white flex items-center justify-center text-purple-600 shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-purple-100/50 mb-8 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(168,85,247,0.2)] group-hover:from-purple-600 group-hover:to-purple-500 group-hover:border-purple-500 group-hover:text-white transition-all duration-500">
                <FaBoxOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-purple-700 transition-colors duration-300">Curación Exclusiva</h3>
              <p className="mt-4 text-[16px] font-medium text-slate-500 leading-relaxed pr-6 group-hover:text-slate-700 transition-colors duration-300">Seleccionamos gadgets y artículos únicos que no encontrarás en otro lugar.</p>
            </div>

            <div className="relative z-10 flex items-center gap-2 mt-auto pt-8 text-[15px] font-bold text-purple-600 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <span>Artículos únicos</span>
            </div>
          </motion.div>

          {/* Card 2: Logística Confiable */}
          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={featureVariants} className="group relative p-8 md:p-10 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] rounded-tr-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(168,85,247,0.15)] hover:-translate-y-2 transition-all duration-500 border border-white/80 overflow-hidden text-left flex flex-col justify-between min-h-[320px]">
            {/* Giant Watermark Background Icon */}
            <FaShippingFast className="absolute -bottom-10 -right-10 text-[200px] text-purple-600/5 group-hover:text-purple-600/10 group-hover:scale-110 group-hover:translate-x-4 transition-all duration-700 pointer-events-none" />

            {/* Top Glow Bar on Hover */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-full"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-white flex items-center justify-center text-purple-600 shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-purple-100/50 mb-8 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(168,85,247,0.2)] group-hover:from-purple-600 group-hover:to-purple-500 group-hover:border-purple-500 group-hover:text-white transition-all duration-500">
                <FaShippingFast className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-purple-700 transition-colors duration-300">Logística Confiable</h3>
              <p className="mt-4 text-[16px] font-medium text-slate-500 leading-relaxed pr-6 group-hover:text-slate-700 transition-colors duration-300">Tu pedido llega seguro y a tiempo, en cualquier rincón del Ecuador.</p>
            </div>

            <div className="relative z-10 flex items-center gap-2 mt-auto pt-8 text-[15px] font-bold text-purple-600 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <span>Rastreo garantizado</span>
            </div>
          </motion.div>

          {/* Card 3: Compra sin Riesgo */}
          <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={featureVariants} className="group relative p-8 md:p-10 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] rounded-tr-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(168,85,247,0.15)] hover:-translate-y-2 transition-all duration-500 border border-white/80 overflow-hidden text-left flex flex-col justify-between min-h-[320px]">
            {/* Giant Watermark Background Icon */}
            <FaHandHoldingUsd className="absolute -bottom-10 -right-10 text-[200px] text-purple-600/5 group-hover:text-purple-600/10 group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-700 pointer-events-none" />

            {/* Top Glow Bar on Hover */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-full"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-white flex items-center justify-center text-purple-600 shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-purple-100/50 mb-8 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(168,85,247,0.2)] group-hover:from-purple-600 group-hover:to-purple-500 group-hover:border-purple-500 group-hover:text-white transition-all duration-500">
                <FaHandHoldingUsd className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-purple-700 transition-colors duration-300">Compra sin Riesgo</h3>
              <p className="mt-4 text-[16px] font-medium text-slate-500 leading-relaxed pr-6 group-hover:text-slate-700 transition-colors duration-300">En Quito, paga solo cuando tengas el producto en tus manos.</p>
            </div>

            <div className="relative z-10 flex items-center gap-2 mt-auto pt-8 text-[15px] font-bold text-purple-600 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <span>Pago contra entrega</span>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};