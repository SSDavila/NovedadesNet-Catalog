'use client';

import { FaEye, FaPaperPlane, FaFilePdf, FaFileCode, FaEnvelope, FaSpinner, FaSync } from 'react-icons/fa';
import { Invoice } from '@/interfaces/invoice';

interface InvoiceCardProps {
  invoice: Invoice;
  onAction: (action: string, invoiceId: number) => void;
  isProcessing?: boolean;
}

const getStatusBadge = (status: string) => {
  const styles: { [key: string]: string } = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    FIRMADO: 'bg-blue-100 text-blue-800',
    RECIBIDA: 'bg-indigo-100 text-indigo-800',
    AUTORIZADO: 'bg-green-100 text-green-800',
    'NO AUTORIZADO': 'bg-red-100 text-red-800',
    RECHAZADO: 'bg-red-100 text-red-800',
    ANULADA: 'bg-gray-100 text-gray-800',
  };
  return `px-3 py-1 text-xs font-bold rounded-full ${styles[status] || 'bg-gray-200'}`;
};

export default function InvoiceCard({ invoice, onAction, isProcessing = false }: InvoiceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="p-5 border-b border-gray-100 flex justify-between items-start">
        <div>
          <p className="font-bold text-lg text-gray-800">{invoice.invoiceNumber}</p>
          <p className="text-sm text-gray-600 truncate" title={invoice.customer.customerName}>{invoice.customer.customerName}</p>
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && <FaSpinner className="animate-spin text-blue-500" />}
          <span className={getStatusBadge(invoice.invoiceStatus)}>
            {invoice.invoiceStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="p-5 flex-grow">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Total:</p>
          <p className="text-xl font-bold text-gray-900">${Number(invoice.invoiceTotal).toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500">Fecha:</p>
          <p className="text-sm text-gray-700">{new Date(invoice.invoiceCreatedAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="p-3 bg-gray-50/70 rounded-b-xl border-t flex justify-end items-center gap-2">
        {['PENDIENTE', 'NO AUTORIZADO', 'RECHAZADO', 'RECIBIDA'].includes(invoice.invoiceStatus) && (
          <button 
            onClick={() => onAction('authorize', invoice.invoiceId)} 
            title="Procesar con SRI" 
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:text-gray-300 transition-colors" 
            disabled={isProcessing}
          >
            <FaSync className={isProcessing ? 'animate-spin' : ''} />
          </button>
        )}
        
        {invoice.invoiceStatus === 'AUTORIZADO' && (
            <>
                <button 
                    onClick={() => onAction('print', invoice.invoiceId)} 
                    title="Descargar RIDE (PDF)" 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full disabled:text-gray-300 transition-colors" 
                    disabled={isProcessing}
                >
                    <FaFilePdf />
                </button>
                <button 
                    onClick={() => onAction('sendEmail', invoice.invoiceId)} 
                    title="Enviar por Email" 
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-full disabled:text-gray-300 transition-colors" 
                    disabled={isProcessing}
                >
                    <FaEnvelope />
                </button>
            </>
        )}

        <button 
            onClick={() => onAction('view', invoice.invoiceId)} 
            title="Ver Detalle" 
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-full disabled:text-gray-300 transition-colors" 
            disabled={isProcessing}
        >
          <FaEye />
        </button>
      </div>

    </div>
  );
}