'use client';

import { useState, useMemo, Fragment } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Combobox, Transition } from '@headlessui/react';
import { FaUser, FaBoxOpen, FaTrash, FaCreditCard } from 'react-icons/fa';
import { HiChevronUpDown, HiCheck } from 'react-icons/hi2';
import { Customer, Product } from '@/interfaces';
import { InvoiceFormData, InvoiceItem } from './NewInvoiceModal';

interface NewInvoiceFormProps {
  customers: Customer[];
  products: Product[];
}

const IVA_RATE = 0.12;

const paymentMethods = [
    { code: '01', name: 'SIN UTILIZACION DEL SISTEMA FINANCIERO' },
    { code: '15', name: 'COMPENSACIÓN DE DEUDAS' },
    { code: '16', name: 'TARJETA DE DÉBITO' },
    { code: '17', name: 'DINERO ELECTRÓNICO' },
    { code: '18', name: 'TARJETA PREPAGO' },
    { code: '19', name: 'TARJETA DE CRÉDITO' },
    { code: '20', name: 'OTROS CON UTILIZACION DEL SISTEMA FINANCIERO' },
    { code: '21', name: 'ENDOSO DE TÍTULOS' },
];

export default function NewInvoiceForm({ customers = [], products = [] }: NewInvoiceFormProps) {
  const { control, watch, setValue } = useFormContext<InvoiceFormData>();
  const customer = watch('customer');
  const items = watch('items');

  const [customerQuery, setCustomerQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const customerOptions = useMemo(() => customers.map(c => ({
    value: c.customerId,
    label: `${c.customerName} (${c.customerIdentificationNumber})`,
    ruc: c.customerIdentificationNumber,
    address: c.customerAddress || '',
    phone: c.customerPhone || '',
    email: c.customerEmail,
  })), [customers]);

  const filteredCustomers = customerQuery === '' ? customerOptions : customerOptions.filter(c =>
    c.label.toLowerCase().includes(customerQuery.toLowerCase())
  );

  const filteredProducts = productQuery === '' ? products : products.filter(p =>
    p.productName.toLowerCase().includes(productQuery.toLowerCase())
  );

  const handleAddItem = () => {
    if (!selectedProduct) return;
    const existingItem = items.find(item => item.productId === selectedProduct.productId);
    if (existingItem) {
      const newItems = items.map(item =>
        item.productId === selectedProduct.productId
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price * (1 - item.discount / 100) }
          : item
      );
      setValue('items', newItems, { shouldValidate: true });
    } else {
      const newItem: InvoiceItem = {
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        quantity: 1,
        price: Number(selectedProduct.productPrice),
        discount: 0,
        subtotal: Number(selectedProduct.productPrice),
      };
      setValue('items', [...items, newItem], { shouldValidate: true });
    }
    setSelectedProduct(null);
    setProductQuery('');
  };

  const handleItemChange = (productId: string, field: 'quantity' | 'discount', value: number) => {
    const newItems = items.map(item => {
      if (item.productId === productId) {
        const updatedItem = { ...item, [field]: value };
        const subtotal = updatedItem.quantity * updatedItem.price * (1 - updatedItem.discount / 100);
        return { ...updatedItem, subtotal };
      }
      return item;
    }).filter(item => item.quantity > 0);
    setValue('items', newItems, { shouldValidate: true });
  };

  const handleRemoveItem = (productId: string) => {
    const newItems = items.filter(item => item.productId !== productId);
    setValue('items', newItems, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaUser /> Datos del Cliente</legend>
        <Controller
          name="customer"
          control={control}
          rules={{ required: 'Debe seleccionar un cliente' }}
          render={({ field, fieldState }) => (
            <>
              <Combobox {...field} nullable>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><FaUser className="h-5 w-5 text-gray-400" /></div>
                  <Combobox.Input
                    className="w-full rounded-md border-0 bg-white py-2.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    onChange={(e) => setCustomerQuery(e.target.value)}
                    displayValue={(c: any) => c?.label || ''}
                    placeholder="Buscar cliente por nombre o RUC..."
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2"><HiChevronUpDown className="h-5 w-5 text-gray-400" /></Combobox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredCustomers.length === 0 && customerQuery !== '' ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700">No se encontró ningún cliente.</div>
                      ) : (
                        filteredCustomers.map((c) => (
                          <Combobox.Option key={c.value} value={c} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}>
                            {({ selected, active }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{c.label}</span>
                                {selected && <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-indigo-600'}`}><HiCheck className="h-5 w-5" /></span>}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
              {fieldState.error && <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>}
            </>
          )}
        />
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaBoxOpen /> Ítems de la Factura</legend>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-grow">
            <Combobox value={selectedProduct} onChange={setSelectedProduct} nullable>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><FaBoxOpen className="h-5 w-5 text-gray-400" /></div>
                <Combobox.Input
                  className="w-full rounded-md border-0 bg-white py-2.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  onChange={(e) => setProductQuery(e.target.value)}
                  displayValue={(p: Product) => p?.productName || ''}
                  placeholder="Buscar producto para agregar..."
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2"><HiChevronUpDown className="h-5 w-5 text-gray-400" /></Combobox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredProducts.map((p) => (
                      <Combobox.Option key={p.productId} value={p} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}>
                        <div className="flex justify-between">
                          <span>{p.productName}</span>
                          <span className="font-mono text-sm text-gray-500">${Number(p.productPrice).toFixed(2)}</span>
                        </div>
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
          <button type="button" onClick={handleAddItem} disabled={!selectedProduct} className="p-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300">Agregar</button>
        </div>

        <div className="flow-root">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-24">Cant.</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase w-28">P. Unit.</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-24">Desc. (%)</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase w-28">Subtotal</th>
                <th className="relative px-4 py-2 w-12"><span className="sr-only">Eliminar</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length > 0 ? items.map(item => (
                <tr key={item.productId}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{item.productName}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.productId, 'quantity', parseInt(e.target.value, 10) || 0)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-center"
                      min="1"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleItemChange(item.productId, 'discount', parseFloat(e.target.value) || 0)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-center"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 font-medium text-right">${item.subtotal.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <button type="button" onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Agrega productos a la factura</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaCreditCard /> Forma de Pago</legend>
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full rounded-md border-0 bg-white py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            >
              {paymentMethods.map(method => (
                <option key={method.code} value={method.code}>
                  {method.code} - {method.name}
                </option>
              ))}
            </select>
          )}
        />
      </fieldset>
    </div>
  );
}