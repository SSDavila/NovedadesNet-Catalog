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
    <div className="bg-slate-50 text-gray-800 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-yellow-50"></div>
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#d7d7d7_1px,transparent_1px),linear-gradient(to_bottom,#d7d7d7_1px,transparent_1px)] bg-[size:36px_36px] opacity-30"
          style={{
            maskImage:
              'radial-gradient(ellipse 80% 140% at 50% 0%,#000 70%,transparent 110%)',
          }}
        ></div>
      </div>

      <div className="relative z-10">
        <Hero />
        <TrustFeatures />

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              {isLoading && (
                <div className="flex justify-center items-center h-full min-h-[450px]"><p className="text-gray-500">Cargando ofertas...</p></div>
              )}
              {error && (
                <div className="flex justify-center items-center h-full min-h-[450px]"><p className="text-red-500">{error}</p></div>
              )}
              {!isLoading && !error && (
                <ProductCarousel products={featuredProducts} title="Ofertas Imperdibles" subtitle="Los más pedidos por nuestra comunidad. ¡No te los pierdas!" />
              )}
            </div>
            <div className="lg:col-span-1">
              <DiscoverCard product={featuredProducts[3]} />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white/50 backdrop-blur-sm">
        <Testimonials testimonials={testimonials} />
          <motion.div
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <GradientTitle icon={<FaMapMarkerAlt />} text="Encuéntranos" gradientId="map-gradient" />
              <p className="mt-4 text-lg text-gray-600">
                Visita nuestro local en el C.C Quitus, Segundo Piso, Local 111.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl border border-gray-200"
            >

              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.793286119256!2d-78.50171289164177!3d-0.2029683696452414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59a3fbb8e0733%3A0xf6488c5a9d564f5a!2sCentro%20Comercial%20Artesanal%20Quitus!5e0!3m2!1ses!2sus!4v1762728665543!5m2!1ses!2sus" 
              width="1000" 
              height="450" 
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
              </iframe>

            </motion.div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
