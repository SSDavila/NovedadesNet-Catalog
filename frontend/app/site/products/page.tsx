'use client';
import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import ProductCard from './components/ProductCard';
import CategoryFilterCarousel from './components/CategoryFilterCarousel';
import { Product } from '@/interfaces/product';

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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Nuestros Productos
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Explora nuestro catálogo y encuentra lo que necesitas.
          </p>
        </div>

        <CategoryFilterCarousel
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center mt-16 text-gray-500">
            <FaSpinner className="animate-spin text-4xl mb-4" />
            <p className="text-lg">Cargando productos...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center text-center mt-16 text-red-500 bg-red-50 p-6 rounded-lg">
            <FaExclamationTriangle className="text-4xl mb-4" />
            <p className="text-lg font-semibold">Error al cargar los productos</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.prodId} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-16 text-lg">No hay productos en esta categoría.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
