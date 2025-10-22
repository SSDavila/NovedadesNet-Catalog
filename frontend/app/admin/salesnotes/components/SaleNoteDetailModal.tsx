'use client';

import { useQuery } from '@tanstack/react-query';
import { FaTimes, FaSpinner, FaUser, FaBox, FaCalendarAlt, FaHashtag, FaDollarSign } from 'react-icons/fa';
import { SaleNote } from '@/interfaces';
import { API_BASE_URL } from '@/lib/constants';

interface SaleNoteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleNoteId: number | null;
}

export default function SaleNoteDetailModal({ isOpen, onClose, saleNoteId }: SaleNoteDetailModalProps) {
  const { data: saleNote, isLoading, isError } = useQuery<SaleNote>({
    queryKey: ['saleNote', saleNoteId],
    queryFn: async () => {
      if (!saleNoteId) throw new Error('No ID provided');
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/sale-notes/${saleNoteId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('No se pudo cargar el detalle de la nota de venta.');
      }
      return response.json();
    },
    enabled: !!saleNoteId && isOpen,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition z-10 p-2 rounded-full bg-white/50 hover:bg-white">
          <FaTimes />
        </button>

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Detalle de Nota de Venta</h2>
          {saleNote && <p className="text-gray-600 font-mono">{saleNote.saleNoteNumber}</p>}
        </div>

        <div className="p-6 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {isLoading && <div className="flex justify-center items-center h-full"><FaSpinner className="animate-spin text-blue-600 text-4xl" /></div>}
          {isError && <div className="text-center text-red-500">Error al cargar los detalles.</div>}
          {saleNote && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <p className="flex items-center gap-2"><FaUser className="text-gray-400" /> <strong>Cliente:</strong> {saleNote.customer.customerName}</p>
                  <p className="flex items-center gap-2"><FaUser className="text-gray-400" /> <strong>Vendedor:</strong> {saleNote.seller.userName}</p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-400" /> <strong>Fecha:</strong> {new Date(saleNote.saleNoteCreatedAt).toLocaleString()}</p>
                  <p className="flex items-center gap-2"><FaHashtag className="text-gray-400" /> <strong>Estado:</strong> {saleNote.saleNoteStatus}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Productos</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Producto</th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-600">Cant.</th>
                        <th className="px-4 py-2 text-right font-semibold text-gray-600">P. Unit.</th>
                        <th className="px-4 py-2 text-right font-semibold text-gray-600">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {saleNote.items?.map(item => (
                        <tr key={item.saleNoteItemId}>
                          <td className="px-4 py-2">{item.product.productName}</td>
                          <td className="px-4 py-2 text-center">{item.saleNoteItemQuantity}</td>
                          <td className="px-4 py-2 text-right font-mono">${Number(item.saleNoteItemUnitPrice).toFixed(2)}</td>
                          <td className="px-4 py-2 text-right font-mono">${(Number(item.saleNoteItemUnitPrice) * item.saleNoteItemQuantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 text-right border-t pt-4">
                <p className="text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">${Number(saleNote.saleNoteTotal).toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 bg-gray-100 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}