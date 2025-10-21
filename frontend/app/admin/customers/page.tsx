'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUserTie, FaPlus } from 'react-icons/fa';
import CustomerTable from './components/CustomerTable';
import NewCustomerModal from './components/NewCustomerModal';
import { CustomerFormData } from './components/NewCustomerForm';
import { Customer } from '@/interfaces';
import { API_BASE_URL } from '@/lib/constants';
import { useNotification } from '@/components/Notifications/NotificationContext';

export default function CustomersPage() {
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  const { data: customers = [], isLoading, isError, error } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudieron cargar los clientes.');
      }
      return response.json();
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (newCustomer: CustomerFormData) => {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el cliente');
      }
      return response.json();
    },
    onSuccess: () => {
      addNotification('Cliente creado con éxito', 'success');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsNewCustomerModalOpen(false);
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  const handleCreateCustomer = async (data: CustomerFormData) => {
    await createCustomerMutation.mutateAsync(data);
  };

  if (isError) {
    return <div className="p-8 text-center text-red-600">Error al cargar clientes: {error.message}</div>;
  }

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
        <button
          onClick={() => setIsNewCustomerModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Nuevo Cliente
        </button>
      </header>
      <main>
        {isLoading ? (
          <div className="text-center p-8">Cargando clientes...</div>
        ) : (
          <CustomerTable customers={customers} />
        )}
      </main>
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onSubmit={handleCreateCustomer}
        isSubmitting={createCustomerMutation.isPending}
      />
    </div>
  );
}
