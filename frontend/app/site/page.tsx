'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  FaShippingFast,
  FaBoxOpen,
  FaHandHoldingUsd,
  FaArrowRight,
  FaStar,
  FaQuoteLeft,
  FaWhatsapp,
} from 'react-icons/fa';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
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

  const featureVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const featuredProducts = [
    {
      name: 'Mini Impresora Térmica Portátil',
      image: '/ejemplo-producto-1.jpg',
    },
    {
      name: 'Dispensador de Agua Automático',
      image: '/ejemplo-producto-2.jpg',
    },
    {
      name: 'Lámpara de Luna 3D',
      image: '/ejemplo-producto-3.jpg',
    },
  ];

  const testimonials = [
    {
      name: 'Ana Lucía',
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
      quote:
        'Siempre encuentro productos súper originales que no se ven en otros lados. Ya he comprado varias veces y nunca me decepcionan.',
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      <motion.section
        className="relative text-center py-20 md:py-32 px-4 bg-white overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-green-50 opacity-50"></div>
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]"
            style={{
              maskImage:
                'radial-gradient(ellipse 80% 50% at 50% 0%,#000 70%,transparent 110%)',
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 text-transparent bg-clip-text"
            variants={itemVariants}
          >
            Descubre lo último en productos novedosos.
          </motion.h1>
          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            En Novedades Net, te traemos los artículos más innovadores y
            sorprendentes del mercado, con la comodidad que mereces.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/site/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              Explorar Catálogo <FaArrowRight />
            </Link>
            <a
              href="https://wa.me/+593963988846"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
            >
              <FaWhatsapp /> Pedido Directo
            </a>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              className="p-8 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              variants={featureVariants}
            >
              <FaBoxOpen className="mx-auto h-12 w-12 text-blue-500" />
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Productos Novedosos
              </h3>
              <p className="mt-2 text-gray-600">
                Seleccionamos los productos más creativos e innovadores para que
                siempre estés a la vanguardia.
              </p>
            </motion.div>
            <motion.div
              className="p-8 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              variants={featureVariants}
            >
              <FaShippingFast className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Envíos a todo el País
              </h3>
              <p className="mt-2 text-gray-600">
                No importa dónde te encuentres, llevamos tus pedidos a cualquier
                rincón de Ecuador.
              </p>
            </motion.div>
            <motion.div
              className="p-8 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              variants={featureVariants}
            >
              <FaHandHoldingUsd className="mx-auto h-12 w-12 text-yellow-500" />
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Pago Contra Entrega
              </h3>
              <p className="mt-2 text-gray-600">
                Para tu tranquilidad, ofrecemos pago contra entrega en Quito.
                ¡Paga cuando recibas tu producto!
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="py-16 md:py-24 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Nuestros Destacados
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Una muestra de lo que puedes encontrar.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div key={index} variants={featureVariants}>
                <Link href="/site/products" className="block group">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h4>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <motion.div
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Lo que dicen nuestros clientes
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg flex flex-col"
                variants={featureVariants}
              >
                <FaQuoteLeft className="text-blue-200 text-4xl mb-4" />
                <p className="text-gray-600 flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="mt-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="mt-2 font-bold text-gray-800">
                    {testimonial.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
