'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { FaTimes, FaTrash } from 'react-icons/fa';
import AsyncSelect from 'react-select/async';
import { API_BASE_URL } from '@/lib/constants';

export interface InvoiceFormData {
  customer: { label: string; value: string } | null;
  items: {
    product: { label: string; value: string; price: number } | null;
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    subtotal: number;
  }[];
}

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => void;
  isSubmitting?: boolean;
}

const loadCustomers = async (inputValue: string) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/customers?search=${inputValue}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.map((customer: any) => ({
    label: `${customer.customerName} (${customer.customerIdentificationNumber})`,
    value: customer.customerId,
  }));
};

const loadProducts = async (inputValue: string) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/products?search=${inputValue}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.map((product: any) => ({
    label: product.productName,
    value: product.productId,
    price: product.productPrice,
  }));
};

export default function NewInvoiceModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: NewInvoiceModalProps) {
  const [modalClasses, setModalClasses] = useState('opacity-0 scale-95');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setModalClasses('opacity-100 scale-100'), 10);
    } else {
      setModalClasses('opacity-0 scale-95');
    }
  }, [isOpen]);

  const { register, control, handleSubmit, watch, setValue } = useForm<InvoiceFormData>({
    defaultValues: {
      customer: null,
      items: [{ product: null, productId: '', quantity: 1, unitPrice: 0, discount: 0, subtotal: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  const subtotal = watchedItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  useEffect(() => {
    watchedItems.forEach((item, index) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      const discount = item.discount || 0;
      const newSubtotal = quantity * unitPrice * (1 - discount / 100);
      if (item.subtotal !== newSubtotal) {
        setValue(`items.${index}.subtotal`, newSubtotal);
      }
    });
  }, [watchedItems, setValue]);

  return (
    <div ref={modalRef} className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 ${modalClasses}`}>
        <header className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Nueva Factura</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={24} />
          </button>
        </header>
        <main className="p-6 overflow-y-auto flex-grow">
          <form id="new-invoice-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <Controller
                  name="customer"
                  control={control}
                  rules={{ required: 'Debe seleccionar un cliente' }}
                  render={({ field }) => (
                    <AsyncSelect
                      {...field}
                      cacheOptions
                      defaultOptions
                      loadOptions={loadCustomers}
                      placeholder="Buscar cliente por nombre o identificación..."
                      noOptionsMessage={() => 'No se encontraron clientes'}
                    />
                  )}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ítems de la Factura</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-4 items-center p-2 rounded-md border">
                      <div className="col-span-4">
                        <Controller
                          name={`items.${index}.product`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: selectField }) => (
                            <AsyncSelect
                              {...selectField}
                              loadOptions={loadProducts}
                              placeholder="Buscar producto..."
                              onChange={(option) => {
                                selectField.onChange(option);
                                setValue(`items.${index}.productId`, option?.value || '');
                                setValue(`items.${index}.unitPrice`, option?.price || 0);
                              }}
                            />
                          )}
                        />
                      </div>
                      <input type="number" placeholder="Cant." {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1 })} className="col-span-1 p-2 border rounded-md" />
                      <input type="number" step="0.01" placeholder="P. Unit." {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} className="col-span-2 p-2 border rounded-md" />
                      <input type="number" step="0.01" placeholder="Desc. %" {...register(`items.${index}.discount`, { valueAsNumber: true })} className="col-span-2 p-2 border rounded-md" />
                      <span className="col-span-2 text-right font-medium">${(watchedItems[index]?.subtotal || 0).toFixed(2)}</span>
                      <button type="button" onClick={() => remove(index)} className="col-span-1 text-red-500 hover:text-red-700 justify-self-center">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => append({ product: null, productId: '', quantity: 1, unitPrice: 0, discount: 0, subtotal: 0 })}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Agregar Ítem
                </button>
              </div>

              <div className="border-t pt-4 flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (15%):</span>
                    <span className="font-medium">${iva.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
        <footer className="flex justify-end items-center p-6 border-t mt-auto bg-gray-50 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 rounded-md mr-4 hover:bg-gray-100">
            Cancelar
          </button>
          <button
            type="submit"
            form="new-invoice-form"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Creando...' : 'Crear Factura'}
          </button>
        </footer>
      </div>
    </div>
  );
}