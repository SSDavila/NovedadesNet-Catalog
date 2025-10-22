'use client';

import { SaleNote } from '@/interfaces';
import { FaEye } from 'react-icons/fa';

interface SaleNoteListProps {
  saleNotes: SaleNote[];
  onViewDetails: (saleNoteId: number) => void;
}

const statusClasses: { [key: string]: string } = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  COMPLETADA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800',
};

export default function SaleNoteList({ saleNotes, onViewDetails }: SaleNoteListProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs text-gray-800 uppercase font-semibold">
          <tr>
            <th scope="col" className="px-6 py-3">N° Nota</th>
            <th scope="col" className="px-6 py-3">Cliente</th>
            <th scope="col" className="px-6 py-3">Fecha</th>
            <th scope="col" className="px-6 py-3 text-right">Total</th>
            <th scope="col" className="px-6 py-3 text-center">Estado</th>
            <th scope="col" className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {saleNotes.map((note) => (
            <tr key={note.saleNoteId} className="bg-white border-b hover:bg-gray-50">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {note.saleNoteNumber}
              </th>
              <td className="px-6 py-4">{note.customer.customerName}</td>
              <td className="px-6 py-4">
                {new Date(note.saleNoteCreatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right font-mono">
                ${Number(note.saleNoteTotal).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    statusClasses[note.saleNoteStatus] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {note.saleNoteStatus}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onViewDetails(note.saleNoteId)}
                  className="p-2 text-gray-500 hover:text-blue-600"
                  title="Ver Detalle"
                >
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}