'use client';
import { useState } from 'react';
import ProductDetailModal from './ProductDetailModal';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion?: string;
  imagen: string;
}

export default function ProductCard({ producto }: { producto: Producto }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-64 object-cover"
        />
        <div className="p-4 flex flex-col gap-2">
          <h2 className="font-semibold text-lg text-gray-900">{producto.nombre}</h2>
          <p className="text-blue-600 font-bold text-xl">${producto.precio.toFixed(2)}</p>
          <p className="text-gray-500 text-sm">{producto.categoria}</p>
        </div>
      </div>

      <ProductDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        producto={{
          nombre: producto.nombre,
          precio: producto.precio,
          descripcion: producto.descripcion || 'Sin descripción disponible.',
          imagen: producto.imagen,
          categoria: producto.categoria,
        }}
      />
    </>
  );
}
