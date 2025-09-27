'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import NewProductModal from './components/NewProductModal';
import ProductDetailModal from './components/ProductDetailModal';
import { Product } from './components/ProductCard';
import ProductGrid from './components/ProductGrid';

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los productos.');
      }
      const data = await response.json();
      
      const productsWithNumbers: Product[] = data.map((p: any) => ({
        ...p,
        prodPrice: Number(p.prodPrice),
      }));
      setProducts(productsWithNumbers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductAdded = () => {
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    console.log('Edit product:', product.prodId);
  };

  const handleDelete = (productId: string) => {
    console.log('Delete product:', productId);
  };

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Administrar Productos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Nuevo Producto
        </button>
      </div>

      {loading && <div className="flex justify-center items-center p-10"><FaSpinner className="animate-spin text-4xl text-blue-600" /></div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}

      {!loading && !error && (
        <ProductGrid
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClick={handleCardClick}
        />
      )}

      <NewProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onProductAdded={handleProductAdded} />

      {selectedProduct && (
        <ProductDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          nombre={selectedProduct.prodName}
          precio={selectedProduct.prodPrice}
          descripcion={selectedProduct.prodDescription}
          imagenes={selectedProduct.prodImages.map(img => img.prodImageUrl)}
        />
      )}
    </div>
  );
}