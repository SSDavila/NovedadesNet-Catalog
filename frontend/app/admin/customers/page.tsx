'use client';

import { FaUserTie, FaPlus } from 'react-icons/fa';
import CustomerTable from './components/CustomerTable';

const mockCustomers = [
  { id: '1', name: 'Consumidor Final', identification: '9999999999', email: 'consumidor@final.com', phone: 'N/A' },
  { id: '2', name: 'Ana Gómez', identification: '0987654321', email: 'ana.gomez@example.com', phone: '0987654321' },
  { id: '3', name: 'Empresa XYZ S.A.', identification: '1798765432001', email: 'compras@empresa.xyz', phone: '022999888' },
];

export default function CustomersPage() {
  return (
    <div className="p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaUserTie />
            Clientes
          </h1>
          <p className="text-gray-600 mt-1">Administra la información de tus clientes para la facturación.</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus />
          Nuevo Cliente
        </button>
      </header>
      <main>
        <CustomerTable customers={mockCustomers} />
      </main>
    </div>
  );
}

