'use client';

import { FaArrowLeft, FaPrint, FaPaperPlane, FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <Link href="/admin/invoices" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <FaArrowLeft />
          Volver a Facturas
        </Link>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            <FaTimesCircle /> Anular
          </button>
          <button className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
            <FaPrint /> Imprimir
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <FaPaperPlane /> Enviar al SRI
          </button>
        </div>
      </header>

      <main className="bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto">
        {/* Encabezado de la Factura */}
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Novedades.net</h2>
            <p className="text-gray-500">RUC: 1234567890001</p>
            <p className="text-gray-500">Dirección de la Empresa, Quito</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold uppercase text-gray-500">Factura</h3>
            <p className="font-mono text-gray-800">001-001-000000123</p>
            <p className="text-sm text-gray-500 mt-2">Fecha: 20 de Mayo, 2024</p>
          </div>
        </div>

        {/* Datos del Cliente */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-700 mb-2">Facturar a:</h4>
          <p className="font-bold">Ana Gómez</p>
          <p>C.I: 0987654321</p>
          <p>ana.gomez@example.com</p>
          <p>Av. Principal 123, Quito</p>
        </div>

        {/* Tabla de Items */}
        <table className="min-w-full mb-8">
          <thead className="border-b">
            <tr>
              <th className="text-left py-2 font-semibold text-gray-600">Descripción</th>
              <th className="text-center py-2 font-semibold text-gray-600">Cant.</th>
              <th className="text-right py-2 font-semibold text-gray-600">P. Unit.</th>
              <th className="text-right py-2 font-semibold text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">Auriculares Inalámbricos Sonus</td>
              <td className="py-3 text-center">2</td>
              <td className="py-3 text-right">$44.99</td>
              <td className="py-3 text-right">$89.98</td>
            </tr>
          </tbody>
        </table>

        {/* Totales */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span> <span>$89.98</span></div>
            <div className="flex justify-between"><span className="text-gray-600">IVA (12%):</span> <span>$10.80</span></div>
            <div className="flex justify-between font-bold text-xl border-t pt-2 mt-2"><span className="text-gray-800">Total:</span> <span className="text-blue-600">$100.78</span></div>
          </div>
        </div>
      </main>
    </div>
  );
}

