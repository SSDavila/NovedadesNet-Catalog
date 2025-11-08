import { motion } from 'framer-motion';
import { Product } from '@/interfaces/index';

interface ProductCardProps {
  product: Product;
  onCardClick: (product: Product) => void; 
}

export default function ProductCard({ product, onCardClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <motion.div
      className="group relative flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={() => onCardClick(product)}
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          src={product.images?.[0]?.productImageUrl || 'https://via.placeholder.com/300'}
          alt={product.productName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">
          {product.category?.categoryName}
        </p>
        <h3 className="mt-2 text-base font-semibold text-gray-800 flex-grow">
          {product.productName}
        </h3>
        <p className="mt-3 text-lg font-bold text-gray-900">
          {formatPrice(product.productPrice)}
        </p>
      </div>
    </motion.div>
  );
}