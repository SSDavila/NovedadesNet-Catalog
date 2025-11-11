'use client';

import { Fragment, useMemo } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaEllipsisV, FaEye, FaFilePdf, FaPaperPlane, FaEnvelope, FaFileCode } from 'react-icons/fa';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: 'AUTORIZADA' | 'PENDIENTE' | 'ANULADA' | 'RECHAZADA' | string;
  date: string;
}

interface InvoiceCardProps {
  invoice: Invoice;
  onAction: (action: string, invoiceId: string) => void;
  isAuthorizing?: boolean;
  isPrinting?: boolean;
  isDownloadingXml?: boolean;
  isSendingEmail?: boolean;
}

const statusClasses: { [key: string]: { bg: string; text: string; } } = {
  AUTORIZADA: { bg: 'bg-green-100', text: 'text-green-800' },
  PENDIENTE: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  ANULADA: { bg: 'bg-gray-200', text: 'text-gray-600' },
  RECHAZADA: { bg: 'bg-red-100', text: 'text-red-800' },
};

const actionIcons: { [key: string]: JSX.Element } = {
  view: <FaEye className="mr-3" />,
  authorize: <FaPaperPlane className="mr-3" />,
  print: <FaFilePdf className="mr-3" />,
  downloadXml: <FaFileCode className="mr-3" />,
  sendEmail: <FaEnvelope className="mr-3" />,
};

export default function InvoiceCard({ invoice, onAction, isAuthorizing = false, isPrinting = false, isDownloadingXml = false, isSendingEmail = false }: InvoiceCardProps) {
  const statusStyle = statusClasses[invoice.status] || { bg: 'bg-gray-100', text: 'text-gray-800' };

  const actions = useMemo(() => [
    { id: 'view', label: 'Ver Detalle', enabled: true, loading: false },
    { id: 'authorize', label: 'Autorizar en SRI', enabled: invoice.status === 'PENDIENTE', loading: isAuthorizing },
    { id: 'print', label: 'Imprimir PDF (RIDE)', enabled: invoice.status !== 'PENDIENTE', loading: isPrinting },
    { id: 'downloadXml', label: 'Descargar XML', enabled: invoice.status === 'AUTORIZADA', loading: isDownloadingXml },
    { id: 'sendEmail', label: 'Enviar por Correo', enabled: invoice.status === 'AUTORIZADA', loading: isSendingEmail },
  ], [invoice.status, isAuthorizing, isPrinting, isDownloadingXml, isSendingEmail]);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="p-5 border-b border-gray-100 flex justify-between items-start">
        <div>
          <p className="font-bold text-lg text-gray-800">{invoice.invoiceNumber}</p>
          <p className="text-sm text-gray-600">{invoice.customerName}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
          {invoice.status}
        </span>
      </div>
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Total:</p>
          <p className="text-xl font-bold text-gray-900">${Number(invoice.total).toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-500">Fecha:</p>
          <p className="text-sm text-gray-700">{invoice.date}</p>
        </div>
      </div>
      <div className="p-3 bg-gray-50 rounded-b-xl flex justify-end">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="p-2 rounded-full hover:bg-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FaEllipsisV />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 bottom-full mb-2 w-56 origin-bottom-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="px-1 py-1">
                {actions.map((action) => (
                  <Menu.Item key={action.id} disabled={!action.enabled}>
                    {({ active }) => (
                      <button
                        onClick={() => onAction(action.id, invoice.id)} // Pass action.id
                        className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm disabled:text-gray-400 disabled:bg-transparent`}
                        disabled={!action.enabled || action.loading} // Disable if not enabled or loading
                      >
                        {actionIcons[action.id]}
                        {action.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}