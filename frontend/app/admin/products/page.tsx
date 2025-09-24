'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductGrid from './components/ProductGrid';
import FloatingButton from './components/FloatingButton';
import NewProductModal from './components/NewProductModal';
import { Product } from '@/interfaces/product';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleProductAdded = () => {
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Administrar Productos</h1>
        <p className="text-gray-600 mt-1">Agrega, edita y visualiza tus productos.</p>
      </header>

      {isLoading && <p>Cargando productos...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && <ProductGrid products={products} />}

      <FloatingButton onClick={() => setIsModalOpen(true)} />

      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
}