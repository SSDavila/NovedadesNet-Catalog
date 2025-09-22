'use client';
import { useState } from 'react';
import ProductCard from './components/ProductCard';
import CategoryFilterCarousel from './components/CategoryFilterCarousel';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const products: Producto[] = [
    { id: 1, nombre: 'AirPods Pro', precio: 120, categoria: 'Electrónica', imagen: 'https://images.unsplash.com/photo-1585386959984-a4155224a1f2?w=400' },
    { id: 2, nombre: 'Canon Binoculares 20x50', precio: 80, categoria: 'Electrónica', imagen: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400' },
    { id: 3, nombre: 'Impresora Epson EcoTank', precio: 220, categoria: 'Electrónica', imagen: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400' },
    { id: 4, nombre: 'Camiseta Minimal', precio: 25, categoria: 'Ropa', imagen: 'https://images.unsplash.com/photo-1593032457865-2c2fa51f2821?w=400' },
    { id: 5, nombre: 'Zapatillas Deportivas', precio: 60, categoria: 'Deportes', imagen: 'https://images.unsplash.com/photo-1600180758895-623d108c0d1e?w=400' },
    { id: 6, nombre: 'Sofá Moderno', precio: 350, categoria: 'Hogar', imagen: 'https://images.unsplash.com/photo-1598300051633-1b14b4b7c4c4?w=400' },
    { id: 7, nombre: 'Set de Jardinería', precio: 45, categoria: 'Jardinería', imagen: 'https://images.unsplash.com/photo-1590756360398-4a5337803b09?w=400' },
    { id: 8, nombre: 'Novela de Ficción', precio: 18, categoria: 'Libros', imagen: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { id: 9, nombre: 'Cama para Mascota', precio: 55, categoria: 'Mascotas', imagen: 'https://images.unsplash.com/photo-1585740333294-4b269389a0a6?w=400' },
    { id: 10, nombre: 'Cubo Rubik', precio: 15, categoria: 'Juguetes', imagen: 'https://images.unsplash.com/photo-1591991564031-61f167334a3a?w=400' },
    { id: 11, nombre: 'Crema Hidratante', precio: 30, categoria: 'Belleza', imagen: 'https://images.unsplash.com/photo-1590152914029-6523421259b3?w=400' },
    { id: 12, nombre: 'Set de Cuchillos', precio: 90, categoria: 'Cocina', imagen: 'https://images.unsplash.com/photo-1618197405750-36cb553e1b12?w=400' },
    { id: 13, nombre: 'Silla Ergonómica', precio: 180, categoria: 'Oficina', imagen: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400' },
    { id: 14, nombre: 'Taladro Inalámbrico', precio: 110, categoria: 'Herramientas', imagen: 'https://images.unsplash.com/photo-1595623228136-3a404a359153?w=400' },
  ];

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoria === selectedCategory)
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
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} producto={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
