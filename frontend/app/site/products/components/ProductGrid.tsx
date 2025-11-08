import { motion } from 'framer-motion';
import { Product } from '@/interfaces/index';
import ProductCard from './ProductCard';
import { containerVariants, itemVariants } from '../animations/variants';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.p className="text-center text-gray-500 mt-16 text-lg" variants={itemVariants}>
        No hay productos que coincidan con tu búsqueda.
      </motion.p>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
      variants={containerVariants}
    >
      {products.map(product => (
        <motion.div key={product.productId} variants={itemVariants}>
          <ProductCard product={product} onCardClick={onProductClick} />
        </motion.div>
      ))}
    </motion.div>
  );
}