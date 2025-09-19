'use client';
import { FaTimes } from 'react-icons/fa';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: {
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
  };
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  producto,
}: ProductDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo difuminado, igual que otros modales */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
        >
          <FaTimes />
        </button>

        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-64 object-cover rounded-t-2xl"
        />

        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{producto.nombre}</h2>
          <p className="text-blue-600 font-bold text-xl">${producto.precio.toFixed(2)}</p>
          <p className="text-gray-700">{producto.descripcion}</p>
          <p className="text-gray-500 text-sm">Categoría: {producto.categoria}</p>

          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
