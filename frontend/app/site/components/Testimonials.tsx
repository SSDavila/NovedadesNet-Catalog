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
    <section className="py-6 md:py-8">
      <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ staggerChildren: 0.2 }}>
        <motion.div variants={itemVariants} className="text-center mb-8">
          <GradientTitle icon={<FaShieldAlt />} text="Nuestros Clientes" gradientId="shield-gradient" />
          <p className="mt-4 text-[17px] font-medium text-slate-600 max-w-2xl mx-auto">Lo que nuestra comunidad dice sobre nosotros.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} className="group relative bg-gradient-to-b from-white/95 to-white/60 backdrop-blur-xl p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] hover:-translate-y-2 transition-all duration-500 border border-white/60 flex flex-col overflow-hidden" variants={featureVariants}>
              <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-purple-300/40 transition-colors duration-500 pointer-events-none z-10"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-400/10 rounded-full blur-[50px] group-hover:bg-yellow-400/20 transition-colors duration-500 pointer-events-none"></div>

              <div className="relative mb-6 z-20">
                <FaQuoteLeft className="text-5xl opacity-10 absolute -top-4 -left-2 z-0 font-black text-slate-700" />
                <FaQuoteLeft className="text-4xl text-purple-300 relative z-10 group-hover:scale-110 group-hover:-rotate-6 group-hover:text-purple-600 transition-all duration-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
              </div>

              <p className="text-[16px] font-medium text-slate-700 flex-grow leading-relaxed relative z-20">"{testimonial.quote}"</p>

              <div className="mt-8 pt-6 relative z-20">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/40 to-transparent"></div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-purple-600 transition-colors">{testimonial.name}</p>
                    <p className="text-[11px] font-black text-purple-600/70 uppercase tracking-widest mt-1 group-hover:text-purple-500 transition-colors">Cliente Verificado</p>
                  </div>
                  <div className="flex gap-1 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)] group-hover:scale-105 transition-transform duration-500">
                    {[...Array(5)].map((_, i) => (<FaStar key={i} size={16} />))}
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}