'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import NewCustomerForm, { CustomerFormData } from './NewCustomerForm';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function NewCustomerModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: NewCustomerModalProps) {
  const methods = useForm<CustomerFormData>({
    defaultValues: {
      customerIdentificationType: 'CEDULA',
      customerIdentificationNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
    },
  });

  const handleFormSubmit = (data: CustomerFormData) => {
    onSubmit(data).then(() => {
      if (!isSubmitting) {
        methods.reset();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition z-30 p-2 rounded-full bg-white/50 hover:bg-white"
        >
          <FaTimes />
        </button>

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Nuevo Cliente</h2>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex-grow flex flex-col overflow-hidden">
            <div className="p-6 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <NewCustomerForm />
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 flex items-center gap-2"
              >
                {isSubmitting ? (<><FaSpinner className="animate-spin" /> Guardando...</>) : ('Guardar Cliente')}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}