'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import NewInvoiceForm from './NewInvoiceForm';
import { InvoicePreview } from './InvoicePreview';
import { Customer, Product } from '@/interfaces';
import axios from 'axios';
import { motion } from 'framer-motion';
import { backdropVariants, modalVariants } from '@/app/animations/modalVariants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number; 
  subtotal: number;
}

export interface InvoiceFormData {
  customerId: string;
  items: InvoiceItem[];
  paymentMethod: string;
}

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => void;
  isSubmitting: boolean;
}

export default function NewInvoiceModal({ isOpen, onClose, onSubmit, isSubmitting }: NewInvoiceModalProps) {
  const methods = useForm<InvoiceFormData>({
    defaultValues: { customerId: '', items: [], paymentMethod: '01' },
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const [customersRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/customers`, { headers }),
          axios.get(`${API_URL}/products`, { headers }),
        ]);
        setCustomers(customersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching data for invoice:", error);
      }
    };
    fetchData();
  }, [isOpen]);

  const handleFormSubmit: SubmitHandler<InvoiceFormData> = (data) => onSubmit(data);

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()} 
      >
        <header className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Nueva Factura</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"><FaTimes /></button>
        </header>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex-grow flex flex-col overflow-hidden">
            <div className="grid lg:grid-cols-2 flex-grow overflow-hidden">
              <div className="overflow-y-auto p-8 bg-white"><NewInvoiceForm customers={customers} products={products} /></div>
              <div className="hidden lg:flex flex-col bg-gray-100 p-8 border-l overflow-y-auto"><InvoicePreview /></div>
            </div>
            <footer className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
              <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2">
                {isSubmitting ? (<><FaSpinner className="animate-spin" /> Creando...</>) : 'Crear Factura'}
              </button>
            </footer>
          </form>
        </FormProvider>
      </motion.div>
    </motion.div>
  );
}