'use client';

import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { InvoiceFormData } from './NewInvoiceModal';

const IVA_RATE = 0.15;

interface InvoicePreviewProps {
  data?: InvoiceFormData | null;
  invoiceNumber?: string;
  invoiceDate?: string;
}

export function InvoicePreview({ data: externalData, invoiceNumber, invoiceDate }: InvoicePreviewProps) {
  const methods = useFormContext<InvoiceFormData>();
  const data = externalData || methods?.watch();

  const items = data?.items || [];

  const totals = useMemo(() => {
    let sub0 = 0;
    let sub15 = 0;
    let disc = 0;

    items.forEach((item) => {
      const itemSub = Math.max(0, (item.quantity * item.price) - (item.discount || 0));
      disc += (item.discount || 0);
      if (item.grabaIva) {
        sub15 += itemSub;
      } else {
        sub0 += itemSub;
      }
    });

    const tax = sub15 * IVA_RATE;
    const total = sub0 + sub15 + tax;
    return { subtotal0: sub0, subtotal15: sub15, totalDiscount: disc, iva: tax, total };
  }, [items]);

  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Factura</h2>
          <p className="text-xs font-semibold text-purple-600 tracking-wider uppercase">Documento Tributario</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700">{invoiceNumber || '#001-001-000000001'}</p>
          <p className="text-xs text-gray-500">
            Fecha: {invoiceDate ? new Date(invoiceDate).toLocaleDateString('es-EC') : new Date().toLocaleDateString('es-EC')}
          </p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-2">Cliente:</h3>
        {data.customerId ? (
          <div className="text-sm text-gray-600 space-y-0.5">
            <p className="font-bold text-gray-900">{data.customerId}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Seleccione un cliente para previsualizar los datos...</p>
        )}
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr className="text-left text-gray-600">
              <th className="py-2.5 px-2 font-semibold w-16">Cant.</th>
              <th className="py-2.5 px-3 font-semibold w-48 sm:w-60 min-w-[160px] max-w-[240px]">Descripción</th>
              <th className="py-2.5 px-2 font-semibold text-right">P. Unit.</th>
              <th className="py-2.5 px-2 font-semibold text-center">Desc. ($)</th>
              <th className="py-2.5 px-2 font-semibold text-center">IVA</th>
              <th className="py-2.5 px-2 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length > 0 ? items.map((item) => {
              const itemIva = item.grabaIva ? item.subtotal * IVA_RATE : 0;
              const itemTotal = item.subtotal + itemIva;

              return (
                <tr key={item.productId}>
                  <td className="py-2.5 px-2 text-gray-700 font-medium">{item.quantity}</td>
                  <td className="py-2.5 px-3">
                    <div className="w-48 sm:w-60 min-w-[160px] max-w-[240px] whitespace-normal break-words leading-snug font-medium text-gray-900">
                      {item.productName}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right text-gray-600 font-medium whitespace-nowrap">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-gray-600 whitespace-nowrap">
                    {item.discount > 0 ? (
                      <span className="font-semibold text-rose-600">-${item.discount.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-400">$0.00</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center whitespace-nowrap">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      item.grabaIva ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.grabaIva ? '15%' : '0%'}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold text-gray-900 whitespace-nowrap">
                    ${itemTotal.toFixed(2)}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400 italic">
                  No hay productos agregados en esta factura.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end border-t pt-4">
        <div className="w-full max-w-xs space-y-1.5 text-sm">
          {totals.subtotal0 > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Subtotal 0% IVA:</span>
              <span className="font-semibold text-gray-800">${totals.subtotal0.toFixed(2)}</span>
            </div>
          )}
          {totals.subtotal15 > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Subtotal 15% IVA:</span>
              <span className="font-semibold text-gray-800">${totals.subtotal15.toFixed(2)}</span>
            </div>
          )}
          {totals.totalDiscount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Descuento total:</span>
              <span className="font-bold text-rose-600">-${totals.totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>IVA (15%):</span>
            <span className="font-semibold text-gray-800">${totals.iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
            <span className="text-gray-900">Total a Pagar:</span>
            <span className="text-purple-600 text-lg font-black">${totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}