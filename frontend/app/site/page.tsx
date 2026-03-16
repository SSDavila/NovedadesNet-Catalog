'use client';

import { Hero } from './components/Hero';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { ProductCarousel } from './components/ProductCarousel';
import { Testimonials } from './components/Testimonials';
import { TrustFeatures } from './components/TrustFeatures';
import { DiscoverCard } from './components/DiscoverCard';
import { GradientTitle } from './components/GradientTitle';
import { motion, Variants } from 'framer-motion';
import { useBestSellers } from './hooks/useBestSellers';

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const featureVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const { featuredProducts, isLoading, error } = useBestSellers();

  const testimonials = [
    {
      name: 'Ana Lucía V.',
      quote:
        '¡Increíble la rapidez del envío! El producto llegó en perfecto estado y es tal como se describe. ¡Totalmente recomendados!',
    },
    {
      name: 'Carlos R.',
      quote:
        'Primera vez que compro y la experiencia fue excelente. El pago contra entrega en Quito me dio mucha seguridad. ¡Gracias!',
    },
    {
      name: 'Sofía V.',
      quote: 'La atención por WhatsApp es de primera. Me ayudaron a elegir el regalo perfecto y la entrega fue súper rápida. ¡Gracias!',
    },
  ];

  return (
    <div className="bg-white text-gray-800 relative overflow-hidden min-h-screen -mt-20 pt-20">
      {/* Exact Background Decor from Products Page */}
      <div className="absolute -top-20 inset-x-0 bottom-0 overflow-hidden pointer-events-none bg-slate-50/20">
        {/* Main Page Style Grid - Extended Coverage */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.45]"
          style={{
            maskImage: 'linear-gradient(to bottom, #000 70%, transparent 100%)',
          }}
        ></div>

        {/* Decorative Floating Geometry */}
        <div className="absolute top-[5%] left-[5%] w-32 h-32 border border-purple-200/30 rounded-full animate-spin-slow" />
        <div className="absolute top-[15%] right-[10%] w-24 h-24 border border-yellow-200/40 rounded-lg rotate-12" />
        <div className="absolute bottom-[20%] left-[15%] w-40 h-40 border border-indigo-100/30 rounded-full" />
        <div className="absolute bottom-[5%] right-[20%] w-16 h-16 border border-yellow-100/40 rounded-full animate-bounce-slow" />

        {/* Rich Mesh Gradient Base */}
        <div className="absolute inset-0 opacity-[0.6] bg-[radial-gradient(at_0%_0%,rgba(168,85,247,0.12)_0%,transparent_50%),radial-gradient(at_100%_100%,rgba(234,179,8,0.12)_0%,transparent_50%)]" />

        {/* Vibrant Organic Shapes */}
        <div className="absolute -top-[15%] -left-[10%] w-[800px] h-[800px] bg-purple-200/30 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[700px] h-[700px] bg-yellow-100/40 rounded-full blur-[140px]" />

        {/* Subtle Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <div className="relative z-10">
        <Hero />
        <TrustFeatures />

        <section className="py-8 md:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              {isLoading && (
                <div className="flex justify-center items-center h-full min-h-[450px]"><p className="text-gray-500">Cargando ofertas...</p></div>
              )}
              {error && (
                <div className="flex justify-center items-center h-full min-h-[450px]"><p className="text-red-500">{error}</p></div>
              )}
              {!isLoading && !error && featuredProducts.length > 0 && (
                <ProductCarousel products={featuredProducts} title="Ofertas Imperdibles" subtitle="Los más pedidos por nuestra comunidad. ¡No te los pierdas!" />
              )}
            </div>
            <div className="lg:col-span-1">
              <DiscoverCard isLoading={isLoading} />
            </div>
          </div>
        </section>

        <section className="pt-0 pb-6 md:pb-12 relative z-10">
          <Testimonials testimonials={testimonials} />

          <motion.div
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <GradientTitle icon={<FaMapMarkerAlt />} text="Visita Nuestro Local" gradientId="map-gradient" />
              <p className="mt-6 text-[17px] font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Descubre en persona la calidad de nuestros productos. Encuéntranos en el <span className="font-bold text-slate-800">C.C Quitus, Segundo Piso, Local 390.</span>
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="h-80 md:h-[450px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-white/60 bg-white/60 backdrop-blur-xl relative group p-2 md:p-4"
            >
              <div className="absolute inset-0 rounded-[2rem] border border-transparent group-hover:border-purple-300/60 transition-colors duration-500 pointer-events-none z-20"></div>
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative z-10">
                <iframe
                  className="w-full h-full grayscale-[20%] contrast-125"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.793286119256!2d-78.50171289164177!3d-0.2029683696452414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59a3fbb8e0733%3A0xf6488c5a9d564f5a!2sCentro%20Comercial%20Artesanal%20Quitus!5e0!3m2!1ses!2sus!4v1762728665543!5m2!1ses!2sus"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                >
                </iframe>
              </div>
            </motion.div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
