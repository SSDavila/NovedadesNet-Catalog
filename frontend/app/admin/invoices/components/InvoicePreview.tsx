'use client';

import { useFormContext } from 'react-hook-form';
import { InvoiceFormData } from './NewInvoiceModal';

interface InvoicePreviewProps {
  data?: InvoiceFormData | null;
}

export function InvoicePreview({ data: externalData }: InvoicePreviewProps) {
  const methods = useFormContext<InvoiceFormData>();
  // Usa los datos que se pasan directamente (para el modal de detalle) o los del formulario (para el modal de creación)
  const data = externalData || methods?.watch();

  if (!data) return null;

  const { customerId, items } = data;

  // Cálculos de totales basados en la lógica del backend
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDiscount = items.reduce((acc, item) => acc + item.discount, 0);
  const baseImponible = subtotal - totalDiscount;
  const iva = baseImponible * 0.12; // Asumiendo 12% IVA para la vista previa
  const total = baseImponible + iva;

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Vista Previa</h3>
      
      {customerId ? (
        <div className="mb-4">
          <p className="font-semibold">Cliente:</p>
          {/* Aquí podrías buscar el nombre del cliente si lo necesitas */}
          <p className="text-sm text-gray-600">{customerId}</p>
        </div>
      ) : (
        <p className="text-gray-500 mb-4">Seleccione un cliente...</p>
      )}

      <div className="flex-grow overflow-y-auto -mx-6 px-6">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left text-xs text-gray-500 pb-2">Producto</th>
              <th className="text-right text-xs text-gray-500 pb-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map(item => (
              <tr key={item.productId} className="border-b">
                <td className="py-2">
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-gray-500">{item.quantity} x ${item.price.toFixed(2)}</p>
                </td>
                <td className="text-right text-sm font-medium">${item.subtotal.toFixed(2)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-400">Sin ítems</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto pt-4 border-t">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Descuento:</span>
            <span className="text-red-500">-${totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Base Imponible:</span>
            <span>${baseImponible.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">IVA (12%):</span>
            <span>${iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}