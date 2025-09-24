'use client';
import { useState, useEffect, useCallback } from 'react';
import ProductCard from './components/ProductCard';
import CategoryFilterCarousel from './components/CategoryFilterCarousel';
import { Product } from '@/interfaces/product';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

        {/* Carrusel de categorías centrado */}
        <CategoryFilterCarousel
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Grilla de productos */}
        {isLoading && <p className="text-center mt-8">Cargando productos...</p>}
        {error && <p className="text-center text-red-500 mt-8">Error: {error}</p>}
        {!isLoading && !error && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.prodId} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
