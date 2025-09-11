'use client';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  nombre,
  descripcion,
  precio,
  imagen,
}: ProductDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay ligero y difuminado */}
      <div
        className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
        {/* Imagen */}
        <img src={imagen} alt={nombre} className="w-full h-64 object-cover" />

        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{nombre}</h2>
          <p className="text-green-600 font-bold text-xl">${precio.toFixed(2)}</p>
          <p className="text-gray-700">{descripcion}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
