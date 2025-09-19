'use client';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
}

export default function DeleteCategoryModal({ isOpen, onClose, onConfirm, categoryName }: DeleteCategoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Eliminar Categoría</h2>
        <p className="mb-4 text-gray-700">¿Seguro que quieres eliminar "{categoryName}"?</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
