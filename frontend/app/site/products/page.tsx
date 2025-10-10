'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import ProductCard from './components/ProductCard';
import CategoryFilterCarousel from './components/CategoryFilterCarousel';
import { Product } from '@/interfaces/product';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos desde el servidor.');
        }
        const data: any[] = await response.json();
        
        const formattedProducts: Product[] = data.map(p => ({
          ...p,
          prodPrice: Number(p.prodPrice)
        }));

        setProducts(formattedProducts);
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error inesperado.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.prodCategory === selectedCategory)
    : products;

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-yellow-50 opacity-50"></div>
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]"
          style={{
            maskImage:
              'radial-gradient(ellipse 80% 50% at 50% 0%,#000 70%,transparent 110%)',
          }}
        ></div>
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-4" variants={itemVariants}>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-yellow-500 text-transparent bg-clip-text pb-4"
            style={{ backgroundImage: 'linear-gradient(to right, #7c3aed, #eab308)' }}
          >
            Nuestro Catálogo
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Explora nuestra colección de productos únicos e innovadores.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <CategoryFilterCarousel
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </motion.div>

        {isLoading && (
          <div className="text-center py-16">
            <FaSpinner className="mx-auto text-purple-600 text-4xl animate-spin" />
            <p className="mt-4 text-lg text-gray-600">Cargando productos...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-16 bg-red-50 rounded-lg">
            <FaExclamationTriangle className="mx-auto text-red-500 text-4xl" />
            <p className="mt-4 text-lg text-red-700">Error: {error}</p>
          </div>
        )}
        {!isLoading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <motion.div
                className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                variants={containerVariants}
              >
                {filteredProducts.map(product => (
                  <motion.div key={product.prodId} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-center text-gray-500 mt-16 text-lg">No hay productos en esta categoría.</p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
