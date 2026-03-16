'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

interface DiscoverCardProps {
  isLoading: boolean;
}

export const DiscoverCard = ({ isLoading }: DiscoverCardProps) => {
  const cardVariants: any = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="relative rounded-[2rem] overflow-hidden text-white p-10 flex flex-col items-center justify-center h-full shadow-[0_20px_50px_rgb(219,39,119,0.2)] hover:shadow-[0_20px_60px_rgb(219,39,119,0.4)] border border-pink-500/30 transition-all duration-500 text-center group/card"
    >
      {/* Animated Deep Background - Sunset Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-950 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay z-0"></div>

      {/* Asymmetrical Glowing Orbs */}
      <div className="absolute -top-32 -right-10 w-80 h-80 bg-orange-400/40 rounded-full blur-[80px] group-hover/card:scale-125 transition-transform duration-700 z-0"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-500/40 rounded-full blur-[60px] group-hover/card:scale-125 transition-transform duration-700 z-0"></div>

      <div className="relative z-10 w-full">
        <h3 className="text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
          Tecnología que <br />Renueva tu Día
        </h3>
        <p className="mt-4 text-[15px] font-medium text-pink-100/90 max-w-[260px] mx-auto leading-relaxed">
          Desde gadgets para tu auto hasta soluciones para el hogar, cuidado personal e incluso laptops!
        </p>
      </div>

      <div className="my-10 aspect-square w-full relative z-10">
        <div className="absolute inset-0 bg-orange-500/20 blur-[30px] rounded-full transform scale-90 flex-shrink-0 group-hover/card:bg-orange-400/40 transition-colors duration-500 z-0 pointer-events-none"></div>
        {isLoading ? (
          <div className="w-full h-full bg-purple-900/50 rounded-2xl animate-pulse relative z-10 border border-pink-400/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"></div>
        ) : (
          <div className="relative w-full h-full z-10 rotate-1 group-hover/card:rotate-0 transform-gpu group-hover/card:-translate-y-2 transition-all duration-700">
            <Image
              src="/Laptops.png"
              alt="Tecnología"
              width={400} height={400}
              className="object-contain w-full h-full group-hover/card:scale-110 transition-transform duration-700 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            />
          </div>
        )}
      </div>

      <Link href="/site/products" className="relative z-10 w-full sm:w-auto text-center inline-flex items-center justify-center gap-3 px-8 py-4 bg-yellow-400 text-indigo-950 rounded-2xl text-[16px] font-bold shadow-[0_8px_30px_rgb(250,204,21,0.5)] hover:shadow-[0_15px_40px_rgb(250,204,21,0.7)] hover:-translate-y-1 hover:bg-yellow-300 transition-all duration-300 group/btn">
        Descubrir Todo <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};