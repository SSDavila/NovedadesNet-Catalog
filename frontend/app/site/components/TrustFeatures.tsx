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
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={featureVariants} className="group relative p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-purple-100 transition-all duration-300 text-center">
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-purple-300 transition-all duration-300"></div>
            <div className="relative">
              <FaBoxOpen className="mx-auto h-10 w-10 text-purple-600" />
              <h3 className="mt-5 text-lg font-semibold text-gray-900">Curación Exclusiva</h3>
              <p className="mt-2 text-sm text-gray-600">Seleccionamos gadgets y artículos únicos que no encontrarás en otro lugar.</p>
            </div>
          </motion.div>

          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={featureVariants} className="group relative p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-purple-100 transition-all duration-300 text-center">
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-purple-300 transition-all duration-300"></div>
            <FaShippingFast className="mx-auto h-10 w-10 text-purple-600" />
            <h3 className="mt-5 text-lg font-semibold text-gray-900">Logística Confiable</h3>
            <p className="mt-2 text-sm text-gray-600">Tu pedido llega seguro y a tiempo, sin importar en qué rincón de Ecuador te encuentres.</p>
          </motion.div>

          <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={featureVariants} className="group relative p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-purple-100 transition-all duration-300 text-center">
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-purple-300 transition-all duration-300"></div>
            <FaHandHoldingUsd className="mx-auto h-10 w-10 text-purple-600" />
            <h3 className="mt-5 text-lg font-semibold text-gray-900">Compra con Cero Riesgo</h3>
            <p className="mt-2 text-sm text-gray-600">En Quito, paga solo cuando tengas el producto en tus manos. Revisa, confirma y paga con total confianza.</p>
          </motion.div>
        </div>
      </div>

    </section>
  );
};