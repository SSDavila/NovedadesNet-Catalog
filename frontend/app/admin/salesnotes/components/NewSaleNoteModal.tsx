'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import NewSaleNoteForm, { SaleNoteFormData } from './NewSaleNoteForm';
import { SaleNotePreview } from './SaleNotePreview';
import { backdropVariants, modalVariants } from '@/app/animations/modalVariants';
import { Customer, Product } from '@/interfaces';
import { API_BASE_URL } from '@/lib/constants';
import NewCustomerModal from '../../customers/components/NewCustomerModal'; 
import { useNotification } from '@/components/Notifications/NotificationContext';
import { CustomerFormData } from '../../customers/components/NewCustomerForm';

interface NewSaleNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaleNoteFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function NewSaleNoteModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: NewSaleNoteModalProps) {
  const methods = useForm<SaleNoteFormData>({
    defaultValues: { customer: null, items: [] },
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [customersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/customers`, { headers }),
        fetch(`${API_BASE_URL}/products`, { headers }),
      ]);
      if (customersRes.ok) setCustomers(await customersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (error) {
      console.error("Error fetching data for sale note:", error);
    }
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  const handleFormSubmit = (data: SaleNoteFormData) => {
    onSubmit(data);
  };

  const refreshCustomers = async () => {
    const token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE_URL}/customers`, { headers });
      if (res.ok) setCustomers(await res.json());
    } catch (error) {
      console.error("Error refreshing customers:", error);
    }
  };

  const handleCreateCustomer = async (customerData: CustomerFormData) => {
    setIsCreatingCustomer(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el cliente.');
      }
      addNotification('Cliente creado con éxito', 'success');
      setIsNewCustomerModalOpen(false);
      await refreshCustomers();
    } catch (error: any) {
      addNotification(error.message, 'error');
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  return (
    <>
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onSubmit={handleCreateCustomer}
        isSubmitting={isCreatingCustomer}
      />
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div
            className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col relative"
            variants={modalVariants}
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Nueva Nota de Venta</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 transition p-2 rounded-full hover:bg-gray-100">
                <FaTimes />
              </button>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex-grow flex flex-col overflow-hidden">
                <div className="grid lg:grid-cols-2 flex-grow overflow-hidden">
                  <div className="overflow-y-auto p-8 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <NewSaleNoteForm
                      customers={customers}
                      products={products}
                      onCustomersNeedRefresh={refreshCustomers}
                      onAddNewCustomer={() => setIsNewCustomerModalOpen(true)}
                    />
                  </div>
                  <div className="hidden lg:flex flex-col bg-gray-100 p-8 border-l overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <SaleNotePreview data={methods.watch()} />
                  </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                  <button type="button" onClick={handleClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50">Cancelar</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 flex items-center gap-2">
                    {isSubmitting ? (<><FaSpinner className="animate-spin" /> Creando...</>) : ('Crear Nota de Venta')}
                  </button>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}