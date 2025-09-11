'use client';

import { useState } from 'react';
import { FaBoxOpen } from 'react-icons/fa';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import FloatingButton from './components/FloatingButton';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      nombre: 'AirPods Pro',
      precio: 120,
      stock: 25,
      descripcion: 'Auriculares inalámbricos con cancelación de ruido activa.',
      imagen: 'https://images.unsplash.com/photo-1585386959984-a4155224a1f2?w=400',
    },
    {
      id: 2,
      nombre: 'Canon Binoculares 20x50',
      precio: 80,
      stock: 10,
      descripcion: 'Visión clara y de largo alcance con zoom de 20x.',
      imagen: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
    },
    {
      id: 3,
      nombre: 'Impresora Epson EcoTank',
      precio: 220,
      stock: 5,
      descripcion: 'Impresora de inyección con tanque de tinta recargable.',
      imagen: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = (nuevo: Producto) => {
    setProductos([...productos, nuevo]);
  };

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900">
        <FaBoxOpen className="text-green-600" />
        Gestión de Productos
      </h1>

      <ProductGrid productos={productos} />

      <FloatingButton onClick={() => setIsModalOpen(true)} />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
        nextId={productos.length + 1}
      />
    </div>
  );
}
