import { FaEye, FaPrint, FaShare } from 'react-icons/fa';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: 'AUTORIZADA' | 'PENDIENTE' | 'ANULADA' | 'RECHAZADA' | string;
  date: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
}

const statusClasses = {
  AUTORIZADA: 'bg-green-100 text-green-800',
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  ANULADA: 'bg-gray-100 text-gray-800',
  RECHAZADA: 'bg-red-100 text-red-800',
};

export default function InvoiceList({ invoices, onView }: InvoiceListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Factura</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-800">${Number(invoice.total).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[invoice.status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => onView(invoice)} className="text-blue-600 hover:text-blue-900"><FaEye /></button>
                    <button className="text-gray-500 hover:text-gray-800"><FaPrint /></button>
                    <button className="text-gray-500 hover:text-gray-800"><FaShare /></button>
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
