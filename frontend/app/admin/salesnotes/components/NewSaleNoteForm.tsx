'use client';

import { useState, useMemo, Fragment } from 'react';
import { useFormContext } from 'react-hook-form';
import { Combobox, Transition } from '@headlessui/react';
import { FaPlus, FaTrash, FaUser, FaBoxOpen } from 'react-icons/fa';
import { HiChevronUpDown, HiCheck } from 'react-icons/hi2';
import { Customer, Product } from '@/interfaces';
import NewCustomerModal from '../../customers/components/NewCustomerModal';

export interface SaleNoteItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface SaleNoteFormData {
  customer: { value: string; label: string; ruc: string; address: string; phone: string; email: string; } | null;
  items: SaleNoteItem[];
}

interface NewSaleNoteFormProps {
  customers: Customer[];
  products: Product[];
  onAddNewCustomer: () => void;
}

const IVA_RATE = 0.12;

export default function NewSaleNoteForm({ customers = [], products = [], onAddNewCustomer }: NewSaleNoteFormProps) {
  const { watch, setValue } = useFormContext<SaleNoteFormData>();
  const customer = watch('customer');
  const items = watch('items');

  const [customerQuery, setCustomerQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const customerOptions = customers.map(c => ({
    value: c.customerId,
    label: `${c.customerName} (${c.customerIdentificationNumber})`,
    ruc: c.customerIdentificationNumber,
    address: c.customerAddress || '',
    phone: c.customerPhone || '',
    email: c.customerEmail,
  }));

  const filteredCustomers = customerQuery === '' ? customerOptions : customerOptions.filter(c =>
    c.label.toLowerCase().includes(customerQuery.toLowerCase())
  );

  const filteredProducts = productQuery === '' ? products : products.filter(p =>
    p.productName.toLowerCase().includes(productQuery.toLowerCase())
  );

  const handleAddItem = () => {
    if (!selectedProduct) return;
    const existingItem = items.find((item: { productId: string; }) => item.productId === selectedProduct.productId);
    if (existingItem) {
        const newItems: SaleNoteItem[] = items.map((item: SaleNoteItem) =>
        item.productId === selectedProduct.productId
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      );
      setValue('items', newItems, { shouldValidate: true });
    } else {
        const newItem: SaleNoteItem = {
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        quantity: 1,
 price: Number(selectedProduct.productPrice),
 subtotal: Number(selectedProduct.productPrice),
      };
      setValue('items', [...items, newItem], { shouldValidate: true });
    }
    setSelectedProduct(null);
    setProductQuery('');
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const newItems = items.map(item =>
      item.productId === productId
        ? { ...item, quantity, subtotal: quantity * item.price }
        : item
    ).filter(item => item.quantity > 0); 
    setValue('items', newItems, { shouldValidate: true });
  };

  const handleRemoveItem = (productId: string) => {
    const newItems = items.filter(item => item.productId !== productId);
    setValue('items', newItems, { shouldValidate: true });
  };

  const { subtotal, iva, total } = useMemo(() => {
    const sub = items.reduce((acc, item) => acc + item.subtotal, 0);
    const tax = sub * IVA_RATE;
    return { subtotal: sub, iva: tax, total: sub + tax };
  }, [items]);

  return (
    <div className="space-y-8">

      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaUser /> Datos del Cliente</legend>
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            <Combobox value={customer} onChange={(c) => setValue('customer', c, { shouldValidate: true })} nullable>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Combobox.Input
                  className="w-full rounded-md border-0 bg-white py-2.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setCustomerQuery(e.target.value)}
                  displayValue={(c: any) => c?.label || ''}
                  placeholder="Buscar cliente por nombre o RUC..."
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredCustomers.length === 0 && customerQuery !== '' ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">No se encontró ningún cliente.</div>
                    ) : (
                      filteredCustomers.map((c) => (
                        <Combobox.Option key={c.value} value={c} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}>
                          {({ selected, active }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{c.label}</span>
                              <span className={`block truncate text-xs ${active ? 'text-indigo-200' : 'text-gray-500'}`}>{c.email}</span>
                              {selected ? (<span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-indigo-600'}`}><HiCheck className="h-5 w-5" aria-hidden="true" /></span>) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
          <button type="button" onClick={onAddNewCustomer} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"><FaPlus /></button>
        </div>
        {customer && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700 space-y-1">
            <p><strong>RUC/Cédula:</strong> {customer.ruc}</p>
            <p><strong>Dirección:</strong> {customer.address}</p>
            <p><strong>Teléfono:</strong> {customer.phone}</p>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaBoxOpen /> Ítems de la Venta</legend>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-grow">
            <Combobox value={selectedProduct} onChange={setSelectedProduct} nullable>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaBoxOpen className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Combobox.Input
                  className="w-full rounded-md border-0 bg-white py-2.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setProductQuery(e.target.value)}
                  displayValue={(p: Product) => p?.productName || ''}
                  placeholder="Buscar producto para agregar..."
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredProducts.length === 0 && productQuery !== '' ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">No se encontró ningún producto.</div>
                    ) : (
                      filteredProducts.map((p) => (
                        <Combobox.Option key={p.productId} value={p} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}>
                          <div className="flex justify-between">
                            <span>{p.productName}</span>
                            <span className={`font-mono text-sm ${'text-gray-500'}`}>
                              ${Number(p.productPrice).toFixed(2)}
                            </span>
                          </div>
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
          <button type="button" onClick={handleAddItem} disabled={!selectedProduct} className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300">Agregar</button>
        </div>

        <div className="flow-root">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-24">Cantidad</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase w-28">P. Unit.</th>
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
                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value, 10) || 0)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-center"
                      min="1"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 font-medium text-right">${item.subtotal.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <button type="button" onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Agrega productos a la nota de venta</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </fieldset>

      <div className="mt-6 border-t pt-6">
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IVA ({IVA_RATE * 100}%):</span>
              <span className="font-medium text-gray-800">${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span className="text-gray-900">Total:</span>
              <span className="text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}