import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

interface ProductCardProps {
  product: {
    name: string;
    image: string;
    category?: string;
    price: number;
    offerPrice?: number | null;
    href: string;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const featureVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  if (!product) {
    return null;
  }

  return (
    <motion.div
      variants={featureVariants}
      className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/20 overflow-hidden group flex flex-col"
    >
      <Link href={product.href} className="block">
        <div className="overflow-hidden relative">
          <Image src={product.image} alt={product.name} width={500} height={500} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
          {product.offerPrice && <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">OFERTA</div>}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        {product.category && (
          <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">
            {product.category}
          </p>
        )}
        <h4 className="mt-2 font-semibold text-gray-800 flex-grow h-12">{product.name}</h4>
        <div className="mt-2 flex items-baseline gap-2">
          {product.offerPrice ? (<><p className="text-xl font-bold text-gray-900">${product.offerPrice.toFixed(2)}</p><p className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</p></>) : (<p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>)}
        </div>
        <Link href={product.href} className="mt-4 w-full text-center bg-purple-100 text-purple-700 font-semibold py-2 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-300">Ver Producto</Link>
      </div>
    </motion.div>
  );
};