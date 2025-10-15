'use client';

import { FaArrowLeft, FaFileInvoice } from 'react-icons/fa';
import Link from 'next/link';

export default function SaleNoteDetailPage({ params }: { params: { id: string } }) {
  // Esta es una página de prototipo, los datos son estáticos.
  return (
    <div className="p-6 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <Link href="/admin/sales-notes" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <FaArrowLeft />
          Volver a Notas de Venta
        </Link>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <FaFileInvoice /> Convertir en Factura
          </button>
        </div>
      </header>

      <main className="bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Novedades.net</h2>
            <p className="text-gray-500">Cotización / Nota de Venta</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold uppercase text-gray-500">Nota de Venta</h3>
            <p className="font-mono text-gray-800">NV-0002</p>
            <p className="text-sm text-gray-500 mt-2">Fecha: 22 de Mayo, 2024</p>
          </div>
        </div>
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">Detalle de la Nota de Venta</p>
          <p>(Aquí iría el contenido detallado de la nota de venta, similar a una factura)</p>
        </div>
      </main>
    </div>
  );
}

