'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { ProductStock } from '@/interfaces';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductStock | null;
  onSubmit: (productId: string, quantityChange: number, reason: string) => void;
  isSubmitting: boolean;
}

export default function AdjustStockModal({ isOpen, onClose, product, onSubmit, isSubmitting }: AdjustStockModalProps) {
  const [quantityChange, setQuantityChange] = useState(1);
  const [reason, setReason] = useState('');
  const [isIncrement, setIsIncrement] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setQuantityChange(1);
      setReason('');
      setIsIncrement(true);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const finalQuantityChange = isIncrement ? quantityChange : -quantityChange;
  const newStock = product.productStock + finalQuantityChange;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStock < 0) {
      alert('El stock no puede ser negativo.');
      return;
    }
    onSubmit(product.productId, finalQuantityChange, reason);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition z-10">
          <FaTimes />
        </button>

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Ajustar Stock</h2>
          <p className="text-sm text-gray-600 truncate">{product.productName}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Stock Actual:</span>
              <span className="font-bold text-lg">{product.productStock}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setIsIncrement(true)} className={`px-3 py-1 rounded-md text-sm font-semibold ${isIncrement ? 'bg-green-600 text-white' : 'bg-gray-200'}`}><FaPlus className="inline mr-1" /> Entrada</button>
                <button type="button" onClick={() => setIsIncrement(false)} className={`px-3 py-1 rounded-md text-sm font-semibold ${!isIncrement ? 'bg-red-600 text-white' : 'bg-gray-200'}`}><FaMinus className="inline mr-1" /> Salida</button>
              </div>
              <input
                type="number"
                value={quantityChange}
                onChange={(e) => setQuantityChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full border-gray-300 rounded-md shadow-sm"
                min="1"
                required
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Razón del ajuste (opcional)</label>
              <input
                id="reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Ej: Conteo físico, devolución, etc."
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">Nuevo Stock:</span>
              <span className={`font-bold text-lg ${newStock < 0 ? 'text-red-500' : 'text-blue-600'}`}>{newStock}</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={isSubmitting || newStock < 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
              {isSubmitting ? 'Guardando...' : 'Guardar Ajuste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}