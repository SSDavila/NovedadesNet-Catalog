'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaTimes, FaSpinner, FaFileAlt } from 'react-icons/fa';
import { SaleNote } from '@/interfaces';
import { API_BASE_URL } from '@/lib/constants';
import { SaleNotePreview } from './SaleNotePreview';

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

  const previewData = useMemo(() => {
    if (!saleNote) return null;
    return {
      customer: {
        value: saleNote.customer.customerId,
        label: `${saleNote.customer.customerName} (${saleNote.customer.customerIdentificationNumber})`,
        ruc: saleNote.customer.customerIdentificationNumber,
        address: saleNote.customer.customerAddress || '',
        phone: saleNote.customer.customerPhone || '',
        email: saleNote.customer.customerEmail,
      },
      items: saleNote.items.map(item => ({
        ...item,
        price: Number(item.saleNoteItemUnitPrice),
        subtotal: Number(item.saleNoteItemUnitPrice) * item.saleNoteItemQuantity,
      })),
    };
  }, [saleNote]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition z-10 p-2 rounded-full bg-white/50 hover:bg-white">
          <FaTimes />
        </button>

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FaFileAlt /> Detalle de Nota de Venta</h2>
        </div>

        <div className="p-8 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-gray-100">
          {isLoading && <div className="flex justify-center items-center h-full"><FaSpinner className="animate-spin text-blue-600 text-4xl" /></div>}
          {isError && <div className="text-center text-red-500">Error al cargar los detalles.</div>}
          {previewData && (
            <SaleNotePreview data={previewData} saleNoteNumber={saleNote.saleNoteNumber} saleNoteDate={saleNote.saleNoteCreatedAt} />
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}