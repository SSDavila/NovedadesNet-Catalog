'use client';

import { useState, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FaUser, FaBoxOpen, FaTrash, FaCreditCard } from 'react-icons/fa';
import { Customer, Product } from '@/interfaces';
import { InvoiceFormData, InvoiceItem } from './NewInvoiceModal';
import Select from 'react-select';

interface NewInvoiceFormProps {
  customers: Customer[];
  products: Product[];
}

const paymentMethods = [
  { value: '01', label: 'SIN UTILIZACION DEL SISTEMA FINANCIERO' },
  { value: '16', label: 'TARJETA DE DÉBITO' },
  { value: '19', label: 'TARJETA DE CRÉDITO' },
  { value: '20', label: 'OTROS CON UTILIZACION DEL SISTEMA FINANCIERO' },
];

export default function NewInvoiceForm({ customers = [], products = [] }: NewInvoiceFormProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<InvoiceFormData>();
  const items = watch('items');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const customerOptions = useMemo(() => customers.map(c => ({
    value: c.customerId,
    label: `${c.customerName} (${c.customerIdentificationNumber})`,
  })), [customers]);

  const productOptions = useMemo(() => products.map(p => ({
    value: p.productId,
    label: `${p.productName} - $${Number(p.productPrice).toFixed(2)}`,
    product: p,
  })), [products]);

  const handleAddItem = () => {
    if (!selectedProduct) return; // selectedProduct ahora es el objeto Product completo
    const existingItem = items.find(item => item.productId === selectedProduct.productId);

    if (existingItem) {
      // Si el item ya existe, solo incrementa la cantidad
      handleItemChange(selectedProduct.productId, 'quantity', existingItem.quantity + 1);
    } else {
      const newItem: InvoiceItem = {
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        quantity: 1,
        price: Number(selectedProduct.productPrice),
        discount: 0, // El valor del descuento, no el porcentaje
        subtotal: Number(selectedProduct.productPrice),
      };
      setValue('items', [...items, newItem], { shouldValidate: true });
    }
    setSelectedProduct(null);
  };

  const handleItemChange = (productId: string, field: 'quantity' | 'discount', value: string) => {
    const numericValue = parseFloat(value) || 0;
    const newItems = items.map(item => {
      if (item.productId === productId) {
        const updatedItem = { ...item, [field]: numericValue };
        // El subtotal es precio * cantidad - descuento
        const subtotal = (updatedItem.quantity * updatedItem.price) - updatedItem.discount;
        return { ...updatedItem, subtotal };
      }
      return item;
    }).filter(item => field === 'quantity' ? item.quantity > 0 : true); // Solo filtra si la cantidad es 0

    setValue('items', newItems, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaUser /> Datos del Cliente</legend>
        <Controller
          name="customerId"
          control={control}
          rules={{ required: 'Debe seleccionar un cliente' }}
          render={({ field }) => (
            <>
              <Select
                options={customerOptions}
                onChange={(option) => field.onChange(option?.value)}
                placeholder="Buscar cliente por nombre o RUC..."
                isClearable
                styles={{ control: (base) => ({ ...base, borderColor: errors.customerId ? 'red' : base.borderColor }) }}
              />
              {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>}
            </>
          )}
        />
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaBoxOpen /> Ítems de la Factura</legend>
        <div className="flex items-start gap-2 mb-4">
          <Select
            options={productOptions}
            onChange={(option) => setSelectedProduct(option?.product || null)}
            placeholder="Buscar producto para agregar..."
            className="flex-grow"
            value={selectedProduct ? { value: selectedProduct.productId, label: selectedProduct.productName, product: selectedProduct } : null}
          />
          <button type="button" onClick={handleAddItem} disabled={!selectedProduct} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300">Agregar</button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-24">Cant.</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase w-28">P. Unit.</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-24">Desc. ($)</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase w-28">Subtotal</th>
              <th className="relative px-4 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length > 0 ? items.map(item => (
              <tr key={item.productId}>
                <td className="px-4 py-2 text-sm text-gray-800">{item.productName}</td>
                <td><input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.productId, 'quantity', e.target.value)} className="w-20 rounded-md border-gray-300 text-center" min="1" /></td>
                <td className="px-4 py-2 text-sm text-gray-500 text-right">${item.price.toFixed(2)}</td>
                <td><input type="number" value={item.discount} onChange={(e) => handleItemChange(item.productId, 'discount', e.target.value)} className="w-20 rounded-md border-gray-300 text-center" min="0" step="0.01" /></td>
                <td className="px-4 py-2 text-sm font-medium text-right">${item.subtotal.toFixed(2)}</td>
                <td className="text-center"><button type="button" onClick={() => handleItemChange(item.productId, 'quantity', '0')} className="text-red-500 hover:text-red-700"><FaTrash /></button></td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">Agrega productos a la factura</td></tr>
            )}
          </tbody>
        </table>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaCreditCard /> Forma de Pago</legend>
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => <Select options={paymentMethods} onChange={(option) => field.onChange(option?.value)} defaultValue={paymentMethods[0]} />}
        />
      </fieldset>
    </div>
  );
}