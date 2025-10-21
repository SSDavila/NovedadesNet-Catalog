'use client';

import { Customer } from '@/interfaces';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface CustomerTableProps {
  customers: Customer[];
  // onEdit: (customer: Customer) => void;
  // onDelete: (customerId: string) => void;
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs text-gray-800 uppercase font-semibold">
          <tr>
            <th scope="col" className="px-6 py-3">Nombre / Razón Social</th>
            <th scope="col" className="px-6 py-3">
              Identificación
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Teléfono
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerId} className="bg-white border-b hover:bg-gray-50">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {customer.customerName}
              </th>
              <td className="px-6 py-4">
                {customer.customerIdentificationNumber}
              </td>
              <td className="px-6 py-4">
                {customer.customerEmail}
              </td>
              <td className="px-6 py-4">
                {customer.customerPhone || 'N/A'}
              </td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <button
                  // onClick={() => onEdit(customer)}
                  className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-300"
                  title="Editar"
                >
                  <FaEdit />
                </button>
                <button
                  // onClick={() => onDelete(customer.customerId)}
                  className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-300"
                  title="Eliminar"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}