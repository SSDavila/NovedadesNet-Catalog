'use client';

import { useState } from 'react';
import { FaStar, FaRegStar, FaShoppingCart, FaEye } from 'react-icons/fa';
import clsx from 'clsx';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion?: string;
  rating: number; // 0-5
  stock: number;
  discount?: string; // opcional
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const stars = Array.from({ length: 5 }, (_, i) =>
    i < product.rating ? (
      <FaStar key={i} className="text-yellow-400 animate-pulse" />
    ) : (
      <FaRegStar key={i} className="text-gray-300" />
    )
  );

  return (
    <div className="relative group bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
      {/* Imagen + Overlay de acciones */}
      <div className="relative h-52 w-full overflow-hidden rounded-t-xl">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
          <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100">
            <FaEye className="text-gray-800" />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={clsx(
              'bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors',
              product.stock === 0 && 'bg-gray-400 cursor-not-allowed'
            )}
          >
            <FaShoppingCart />
          </button>
        </div>

        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
            {product.discount}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col justify-between h-52">
        <div>
          <h2 className="font-semibold text-lg line-clamp-2">{product.nombre}</h2>
          {product.descripcion && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.descripcion}</p>
          )}

          <div className="flex items-center gap-1 mt-2">{stars}</div>

          <p
            className={clsx(
              'mt-1 text-xs font-medium',
              product.stock > 0
                ? 'text-green-600 animate-pulse'
                : 'text-red-600 font-semibold'
            )}
          >
            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
          </p>
        </div>

        {/* Precio y botón */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">${product.precio.toFixed(2)}</p>
            <p className="text-xs text-gray-400">por unidad</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300',
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : added
                ? 'bg-green-500 text-white animate-pulse'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            <FaShoppingCart /> {added ? 'Agregado' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
