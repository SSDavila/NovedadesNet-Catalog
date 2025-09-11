'use client';

import { useState } from 'react';
import ProductDetailModal from '../components/ProductDetailModal';

interface ProductCardProps {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
}

export default function ProductCard({
  nombre,
  descripcion,
  precio,
  stock,
  imagen,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 overflow-hidden group"
      >
        <div className="relative">
          <img src={imagen} alt={nombre} className="w-full h-56 object-cover" />
          {stock === 0 && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              Sin stock
            </span>
          )}
        </div>
        <div className="p-5 flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{nombre}</h3>
          <p className="text-green-600 font-bold text-xl">${precio.toFixed(2)}</p>
          <p className="text-gray-500 text-sm line-clamp-2">{descripcion}</p>
        </div>
      </div>

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nombre={nombre}
        precio={precio}
        descripcion={descripcion}
        imagen={imagen}
      />
    </>
  );
}
