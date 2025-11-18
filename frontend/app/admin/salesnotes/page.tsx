'use client';

import { useState, useEffect } from 'react';
import { FaFileAlt, FaPlus } from 'react-icons/fa';
import SaleNoteList from './components/SaleNoteList';
import NewSaleNoteModal from './components/NewSaleNoteModal';
import SaleNoteDetailModal from './components/SaleNoteDetailModal';
import { useSaleNotes } from './hooks/useSaleNotes';
import { SaleNoteFormData } from './components/NewSaleNoteForm';

export default function SaleNotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSaleNoteId, setSelectedSaleNoteId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  const {
    saleNotes,
    isLoadingSaleNotes,
    isErrorSaleNotes,
    errorSaleNotes,
    createSaleNote,
    isCreatingSaleNote,
  } = useSaleNotes();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCreateSaleNote = async (data: SaleNoteFormData) => {
    createSaleNote(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleViewDetails = (saleNoteId: number) => {
    setSelectedSaleNoteId(saleNoteId);
    setIsDetailModalOpen(true);
  };

  if (isErrorSaleNotes) return <div className="p-8 text-center text-red-600">Error: {errorSaleNotes.message}</div>;

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
        {isClient && isLoadingSaleNotes ? (
          <div className="text-center p-8">Cargando notas de venta...</div>
        ) : (
          <SaleNoteList saleNotes={saleNotes} onViewDetails={handleViewDetails} />
        )}
      </main>
      <NewSaleNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSaleNote}
        isSubmitting={isCreatingSaleNote}
      />
      <SaleNoteDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        saleNoteId={selectedSaleNoteId}
      />
    </div>
  );
}
