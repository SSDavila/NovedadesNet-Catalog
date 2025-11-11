'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import NewInvoiceForm from './NewInvoiceForm';
import { InvoicePreview } from './InvoicePreview';
import { backdropVariants, modalVariants } from '@/app/animations/modalVariants';
import { Customer, Product } from '@/interfaces';
import { API_BASE_URL } from '@/lib/constants';

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}

export interface InvoiceFormData {
  customer: { value: string; label: string; ruc: string; address: string; phone: string; email: string; } | null;
  items: InvoiceItem[];
  paymentMethod: string;
}

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function NewInvoiceModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: NewInvoiceModalProps) {
  const methods = useForm<InvoiceFormData>({
    defaultValues: { 
      customer: null, 
      items: [],
      paymentMethod: '01', // Valor por defecto: SIN UTILIZACION DEL SISTEMA FINANCIERO
    },
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

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
      console.error("Error fetching data for invoice:", error);
    }
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  const handleFormSubmit = (data: InvoiceFormData) => {
    onSubmit(data);
  };

  return (
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
              <h2 className="text-2xl font-bold text-gray-900">Nueva Factura</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 transition p-2 rounded-full hover:bg-gray-100"><FaTimes /></button>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex-grow flex flex-col overflow-hidden">
                <div className="grid lg:grid-cols-2 flex-grow overflow-hidden">
                  <div className="overflow-y-auto p-8 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <NewInvoiceForm customers={customers} products={products} />
                  </div>
                  <div className="hidden lg:flex flex-col bg-gray-100 p-8 border-l overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <InvoicePreview data={methods.watch()} />
                  </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                  <button type="button" onClick={handleClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50">Cancelar</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 flex items-center gap-2">
                    {isSubmitting ? (<><FaSpinner className="animate-spin" /> Creando...</>) : ('Crear Factura')}
                  </button>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}