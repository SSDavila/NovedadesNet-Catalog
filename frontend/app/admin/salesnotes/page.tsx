'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaFileAlt, FaPlus } from 'react-icons/fa';
import SaleNoteList from './components/SaleNoteList';
import NewSaleNoteModal from './components/NewSaleNoteModal';
import SaleNoteDetailModal from './components/SaleNoteDetailModal';
import { SaleNoteFormData } from './components/NewSaleNoteForm';
import { SaleNote } from '@/interfaces';
import { API_BASE_URL } from '@/lib/constants';
import { useNotification } from '@/components/Notifications/NotificationContext';

export default function SaleNotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSaleNoteId, setSelectedSaleNoteId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  const { data: saleNotes = [], isLoading, isError, error } = useQuery<SaleNote[]>({
    queryKey: ['saleNotes'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/sale-notes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar las notas de venta.');
      }
      return response.json();
    },
  });

  const createSaleNoteMutation = useMutation({
    mutationFn: async (data: SaleNoteFormData) => {
      if (!data.customer) throw new Error('Cliente no seleccionado');

      const payload = {
        customerId: data.customer.value,
        items: data.items.map(item => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      };

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/sale-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la nota de venta');
      }
      return response.json();
    },
    onSuccess: () => {
      addNotification('Nota de Venta creada con éxito', 'success');
      queryClient.invalidateQueries({ queryKey: ['saleNotes'] });
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  const handleCreateSaleNote = async (data: SaleNoteFormData) => {
    await createSaleNoteMutation.mutateAsync(data);
  };

  const handleViewDetails = (saleNoteId: number) => {
    setSelectedSaleNoteId(saleNoteId);
    setIsDetailModalOpen(true);
  };

  if (isError) return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaFileAlt />
            Notas de Venta
          </h1>
          <p className="text-gray-600 mt-1">Crea cotizaciones o pre-facturas para tus clientes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Nueva Nota de Venta
        </button>
      </header>

      <main>
        {isLoading ? (
          <div className="text-center p-8">Cargando notas de venta...</div>
        ) : (
          <SaleNoteList saleNotes={saleNotes} onViewDetails={handleViewDetails} />
        )}
      </main>
      <NewSaleNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSaleNote}
        isSubmitting={createSaleNoteMutation.isPending}
      />
      <SaleNoteDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        saleNoteId={selectedSaleNoteId}
      />
    </div>
  );
}
