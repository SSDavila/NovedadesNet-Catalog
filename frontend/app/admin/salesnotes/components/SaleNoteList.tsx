import { FaEye, FaFileInvoice, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

interface SaleNote {
  id: string;
  noteNumber: string;
  customerName: string;
  total: number;
  status: 'COMPLETADA' | 'PENDIENTE' | 'CANCELADA';
  date: string;
}

interface SaleNoteListProps {
  saleNotes: SaleNote[];
}

const statusClasses = {
  COMPLETADA: 'bg-blue-100 text-blue-800',
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  CANCELADA: 'bg-gray-100 text-gray-800',
};

export default function SaleNoteList({ saleNotes }: SaleNoteListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Nota</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {saleNotes.map((note) => (
              <tr key={note.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{note.noteNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{note.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(note.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-800">${note.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[note.status]}`}>
                    {note.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/sales-notes/${note.id}`} className="text-blue-600 hover:text-blue-900"><FaEye /></Link>
                    <button className="text-green-600 hover:text-green-900" title="Facturar"><FaFileInvoice /></button>
                    <button className="text-red-600 hover:text-red-900"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

