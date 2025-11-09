'use client';
import { motion, Variants } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaShieldAlt } from 'react-icons/fa';
import { GradientTitle } from './GradientTitle';

interface TestimonialsProps {
  testimonials: {
    name: string;
    quote: string;
  }[];
}

export const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };
  const featureVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="py-12 md:py-16">
      <motion.div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ staggerChildren: 0.2 }}>
        <motion.div variants={itemVariants} className="text-center mb-16">
          <GradientTitle icon={<FaShieldAlt />} text="La Confianza de Nuestros Clientes" gradientId="shield-gradient" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} className="bg-white/60 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/20 flex flex-col" variants={featureVariants}>
              <FaQuoteLeft className="text-purple-200 text-4xl mb-4" />
              <p className="text-gray-600 flex-grow">"{testimonial.quote}"</p>
              <div className="mt-6">
                <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => (<FaStar key={i} />))}</div>
                <p className="mt-2 font-bold text-gray-800">{testimonial.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};