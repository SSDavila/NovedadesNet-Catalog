'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

interface DiscoverCardProps {
  product?: {
    image: string;
  };
}

export const DiscoverCard = ({ product }: DiscoverCardProps) => {
  const cardVariants: any = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="relative rounded-2xl bg-gradient-to-br from-purple-700 to-purple-900 text-white p-8 flex flex-col items-center justify-center h-full shadow-2xl hover:shadow-purple-200/50 transition-shadow duration-300 text-center"
    >
      <div>
        <h3 className="text-3xl font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          Tecnología que Renueva tu Día
        </h3>
        <p className="mt-2 text-purple-200 max-w-xs mx-auto">
          Desde gadgets para tu auto hasta soluciones para tu hogar.
        </p>
      </div>
      <Image 
        src={product?.image || "/placeholder.jpg"}
        alt="Tecnología" 
        width={400} height={400} 
        className="my-6 rounded-lg object-cover aspect-square shadow-lg" 
      />
      <Link href="/site/products" className="w-auto text-center inline-flex items-center justify-center gap-2 px-8 py-3 bg-yellow-400 text-gray-900 rounded-full text-lg font-semibold shadow-lg hover:bg-white hover:-translate-y-1 transition-all duration-300 group">
        Descubrir <FaArrowRight />
      </Link>
    </motion.div>
  );
};