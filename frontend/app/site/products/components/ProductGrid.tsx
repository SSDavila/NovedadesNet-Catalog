'use client';

import { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import ProductDetailModal from '../components/ProductDetailModal';
import CategoryFilterCarousel from '../components/CategoryFilterCarousel';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  categoria: string;
}

export default function ProductosPage() {
  const [productos] = useState<Producto[]>([
    { id: 1, nombre: 'AirPods Pro', precio: 120, descripcion: 'Auriculares inalámbricos con cancelación de ruido.', imagen: 'https://images.unsplash.com/photo-1585386959984-a4155224a1f2?w=400', categoria: 'Electrónica' },
    { id: 2, nombre: 'Canon Binoculares 20x50', precio: 80, descripcion: 'Visión clara y nítida con zoom 20x.', imagen: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400', categoria: 'Electrónica' },
    { id: 3, nombre: 'Impresora Epson EcoTank', precio: 220, descripcion: 'Impresora de tanque recargable con tinta económica.', imagen: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400', categoria: 'Hogar' },
    { id: 4, nombre: 'Smart Watch', precio: 150, descripcion: 'Monitoreo de salud y notificaciones inteligentes.', imagen: 'https://images.unsplash.com/photo-1583224482830-38c0de23f155?w=400', categoria: 'Ropa' },
  ]);

  const categories = Array.from(new Set(productos.map(p => p.categoria)));

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  const filteredProducts = selectedCategory
    ? productos.filter(p => p.categoria === selectedCategory)
    : productos;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Nuestros Productos</h1>
        <p className="text-gray-600 text-lg">Encuentra lo mejor para ti con estilo y simplicidad.</p>
      </header>

      {/* Filtro carrusel */}
      <CategoryFilterCarousel
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Grid productos */}
      <ProductGrid
        productos={filteredProducts}
        onView={(id) => setSelectedProduct(productos.find(p => p.id === id) || null)}
      />

      {/* Modal producto */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          {...selectedProduct}
        />
      )}
    </div>
  );
}
