'use client';

import { FaFileAlt, FaPlus } from 'react-icons/fa';
import SaleNoteList from './components/SaleNoteList';

const mockSaleNotes = [
  { id: '1', noteNumber: 'NV-0001', customerName: 'Juan Pérez', total: 560.50, status: 'COMPLETADA', date: '2024-05-19' },
  { id: '2', noteNumber: 'NV-0002', customerName: 'Empresa XYZ', total: 1200.00, status: 'PENDIENTE', date: '2024-05-22' },
  { id: '3', noteNumber: 'NV-0003', customerName: 'María Rodríguez', total: 75.20, status: 'CANCELADA', date: '2024-05-20' },
];

export default function SaleNotesPage() {
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
        <button className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus />
          Nueva Nota de Venta
        </button>
      </header>

      <main>
        <SaleNoteList saleNotes={mockSaleNotes} />
      </main>
    </div>
  );
}

