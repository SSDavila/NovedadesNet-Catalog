import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/interfaces/index';
import ProductCard from './ProductCard';
import { Icon } from '@iconify/react';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  return (
    <div className="min-h-[400px]">
      <AnimatePresence mode="popLayout">
        {products.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center pt-24 pb-12"
          >
            <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
              <Icon icon="ph:package-light" width="40" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tighter">No hay productos</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-[240px] text-center leading-relaxed">
              No hemos encontrado coincidencias con los filtros seleccionados.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {products.map(product => (
              <ProductCard
                key={product.productId}
                product={product}
                onCardClick={onProductClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}