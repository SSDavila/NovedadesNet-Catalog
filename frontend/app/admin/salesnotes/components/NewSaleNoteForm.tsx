'use client';

import { useFormContext, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import AsyncSelect from 'react-select/async';
import { Customer, Product } from '@/interfaces';
import { API_BASE_URL } from '@/lib/constants';

export interface SaleNoteFormData {
  customer: { value: string; label: string } | null;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

const loadCustomers = async (inputValue: string) => {
  const response = await fetch(`${API_BASE_URL}/customers?search=${inputValue}`);
  const data: Customer[] = await response.json();
  return data.map(customer => ({
    value: customer.customerId,
    label: `${customer.customerName} (${customer.customerIdentificationNumber})`,
  }));
};

const loadProducts = async (inputValue: string) => {
  if (!inputValue) return [];
  const response = await fetch(`${API_BASE_URL}/products?search=${inputValue}`);
  const data: Product[] = await response.json();
  return data.map(product => ({
    value: product.productId,
    label: `${product.productName} (Stock: ${product.productStock})`,
    ...product,
  }));
};

export default function NewSaleNoteForm() {
  const { control } = useFormContext<SaleNoteFormData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  });

  const items = useWatch({ control, name: 'items' });
  const total = items.reduce((acc, item) => acc + (item?.subtotal || 0), 0);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const item = items[index];
    if (newQuantity > 0) {
      const newSubtotal = item.unitPrice * newQuantity;
      update(index, { ...item, quantity: newQuantity, subtotal: newSubtotal });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">1. Datos del Cliente</h2>
        <Controller
          name="customer"
          control={control}
          rules={{ required: 'Debe seleccionar un cliente.' }}
          render={({ field }) => (
            <AsyncSelect
              {...field}
              cacheOptions
              defaultOptions
              loadOptions={loadCustomers}
              placeholder="Buscar cliente por nombre o identificación..."
            />
          )}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">2. Detalle de Productos</h2>
        <div className="mb-4">
          <AsyncSelect
            loadOptions={loadProducts}
            placeholder="Buscar y agregar producto por nombre o SKU..."
            onChange={(option: any) => {
              if (option) {
                append({
                  productId: option.value,
                  productName: option.productName,
                  quantity: 1,
                  unitPrice: Number(option.productPrice),
                  subtotal: Number(option.productPrice),
                });
              }
            }}
            value={null}
            noOptionsMessage={() => 'No hay productos que coincidan'}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Producto</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-600 w-24">Cant.</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-600 w-32">P. Unit.</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-600 w-32">Subtotal</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="px-4 py-2 font-medium text-gray-800">{field.productName}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      className="w-20 text-center border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={field.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td className="px-4 py-2 text-right font-mono">${field.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-mono font-semibold">${field.subtotal.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {fields.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Agregue productos a la nota de venta.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right border-t pt-4">
          <p className="text-gray-600">Total</p>
          <p className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}