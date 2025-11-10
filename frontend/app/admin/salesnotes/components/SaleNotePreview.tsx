'use client';

import { useMemo } from 'react';
import { SaleNoteFormData } from './NewSaleNoteForm';

interface SaleNotePreviewProps {
  data: SaleNoteFormData;
}

const IVA_RATE = 0.12;

export const SaleNotePreview = ({ data }: SaleNotePreviewProps) => {
  const { subtotal, iva, total } = useMemo(() => {
    const sub = data.items.reduce((acc, item) => acc + item.subtotal, 0);
    const tax = sub * IVA_RATE;
    return { subtotal: sub, iva: tax, total: sub + tax };
  }, [data.items]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border w-full">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Nota de Venta</h2>
          <p className="text-sm text-gray-500">PRE-FACTURA / COTIZACIÓN</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700">Nro. #000-000-000000001</p>
          <p className="text-sm text-gray-500">Fecha: {new Date().toLocaleDateString('es-EC')}</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-700 mb-2">Cliente:</h3>
        {data.customer ? (
          <div className="text-sm text-gray-600">
            <p className="font-bold">{data.customer.label.split(' (')[0]}</p>
            <p>RUC/CI: {data.customer.ruc}</p>
            <p>Dirección: {data.customer.address}</p>
            <p>Teléfono: {data.customer.phone}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Seleccione un cliente...</p>
        )}
      </div>

      <table className="w-full text-sm mb-6">
        <thead className="border-b">
          <tr className="text-left text-gray-600">
            <th className="py-2 font-medium">Cant.</th>
            <th className="py-2 font-medium">Descripción</th>
            <th className="py-2 font-medium text-right">P. Unit.</th>
            <th className="py-2 font-medium text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.length > 0 ? data.items.map(item => (
            <tr key={item.productId} className="border-b border-gray-100">
              <td className="py-2">{item.quantity}</td>
              <td className="py-2">{item.productName}</td>
              <td className="py-2 text-right">${item.price.toFixed(2)}</td>
              <td className="py-2 text-right font-medium">${item.subtotal.toFixed(2)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-400">No hay ítems agregados.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">IVA ({IVA_RATE * 100}%):</span>
            <span className="font-medium">${iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
            <span>Total a Pagar:</span>
            <span className="text-indigo-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};