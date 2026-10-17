'use client';

import { useState, useMemo, Fragment } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Combobox, Transition } from '@headlessui/react';
import { FaPlus, FaTrash, FaUser, FaBoxOpen, FaUserTie } from 'react-icons/fa';
import { HiChevronUpDown, HiCheck } from 'react-icons/hi2';
import { Customer, Product, User } from '@/interfaces';
import { InvoiceFormData, InvoiceItem } from './NewInvoiceModal';
import Select from 'react-select';

const IVA_RATE = 0.15;

interface NewInvoiceFormProps {
  customers: Customer[];
  products: Product[];
  sellers: User[];
}

const paymentMethods = [
  { value: '01', label: 'SIN UTILIZACION DEL SISTEMA FINANCIERO' },
  { value: '16', label: 'TARJETA DE DÉBITO' },
  { value: '19', label: 'TARJETA DE CRÉDITO' },
  { value: '20', label: 'OTROS CON UTILIZACION DEL SISTEMA FINANCIERO' },
];

export default function NewInvoiceForm({ customers = [], products = [], sellers = [] }: NewInvoiceFormProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<InvoiceFormData>();
  const items = watch('items') || [];

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

  const sellerOptions = useMemo(() => sellers.map(u => ({
    value: u.userId,
    label: u.userName,
  })), [sellers]);

  const filteredCustomers = customerQuery === ''
    ? customerOptions
    : customerOptions.filter(c => c.label.toLowerCase().includes(customerQuery.toLowerCase()));

  const filteredProducts = productQuery === ''
    ? products
    : products.filter(p => p.productName.toLowerCase().includes(productQuery.toLowerCase()));

  const handleAddItem = () => {
    if (!selectedProduct) return;
    const existingItem = items.find((item: InvoiceItem) => item.productId === selectedProduct.productId);
    if (existingItem) {
      const newItems: InvoiceItem[] = items.map((item: InvoiceItem) => {
        if (item.productId === selectedProduct.productId) {
          const newQty = item.quantity + 1;
          const subtotal = Math.max(0, (newQty * item.price) - (item.discount || 0));
          return { ...item, quantity: newQty, subtotal };
        }
        return item;
      });
      setValue('items', newItems, { shouldValidate: true });
    } else {
      const price = Number(selectedProduct.productPrice);
      const grabaIva = selectedProduct.productIvaRate === '0' ? false : true;
      const newItem: InvoiceItem = {
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        quantity: 1,
        price,
        discount: 0,
        grabaIva,
        subtotal: price,
      };
      setValue('items', [...items, newItem], { shouldValidate: true });
    }
    setSelectedProduct(null);
    setProductQuery('');
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const newItems = items
      .map((item) => {
        if (item.productId === productId) {
          const subtotal = Math.max(0, (quantity * item.price) - (item.discount || 0));
          return { ...item, quantity, subtotal };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setValue('items', newItems, { shouldValidate: true });
  };

  const handleDiscountChange = (productId: string, discount: number) => {
    const newItems = items.map((item) => {
      if (item.productId === productId) {
        const validDiscount = Math.max(0, isNaN(discount) ? 0 : discount);
        const subtotal = Math.max(0, (item.quantity * item.price) - validDiscount);
        return { ...item, discount: validDiscount, subtotal };
      }
      return item;
    });
    setValue('items', newItems, { shouldValidate: true });
  };

  const handleToggleIva = (productId: string) => {
    const newItems = items.map((item) => {
      if (item.productId === productId) {
        return { ...item, grabaIva: !item.grabaIva };
      }
      return item;
    });
    setValue('items', newItems, { shouldValidate: true });
  };

  const handleRemoveItem = (productId: string) => {
    const newItems = items.filter(item => item.productId !== productId);
    setValue('items', newItems, { shouldValidate: true });
  };

  const totals = useMemo(() => {
    let sub0 = 0;
    let sub15 = 0;
    let disc = 0;

    items.forEach((item) => {
      const itemSub = Math.max(0, (item.quantity * item.price) - (item.discount || 0));
      disc += (item.discount || 0);
      if (item.grabaIva) {
        sub15 += itemSub;
      } else {
        sub0 += itemSub;
      }
    });

    const tax = sub15 * IVA_RATE;
    const total = sub0 + sub15 + tax;
    return { subtotal0: sub0, subtotal15: sub15, totalDiscount: disc, iva: tax, total };
  }, [items]);

  return (
    <div className="space-y-8">
      {/* Datos del Cliente */}
      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUser /> Datos del Cliente
        </legend>
        <Controller
          name="customerId"
          control={control}
          rules={{ required: 'Debe seleccionar un cliente' }}
          render={({ field }) => (
            <>
              <Combobox
                value={customerOptions.find(o => o.value === field.value) ?? null}
                onChange={(c) => field.onChange(c?.value ?? '')}
                nullable
              >
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Combobox.Input
                    className="w-full rounded-md border-0 bg-white py-2.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
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
                          <Combobox.Option key={c.value} value={c} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-purple-600 text-white' : 'text-gray-900'}`}>
                            {({ selected, active }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{c.label}</span>
                                <span className={`block truncate text-xs ${active ? 'text-purple-200' : 'text-gray-500'}`}>{c.email}</span>
                                {selected ? (<span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-purple-600'}`}><HiCheck className="h-5 w-5" aria-hidden="true" /></span>) : null}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
              {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>}
            </>
          )}
        />
      </fieldset>

      {/* Vendedor */}
      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUserTie /> Vendedor
        </legend>
        <Controller
          name="sellerId"
          control={control}
          render={({ field }) => (
            <Select
              options={sellerOptions}
              onChange={(option) => field.onChange(option?.value ?? null)}
              placeholder="Seleccionar vendedor (opcional)..."
              isClearable
              value={sellerOptions.find(o => o.value === field.value) ?? null}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: 'transparent',
                  boxShadow: '0 0 0 1px #d1d5db',
                  borderRadius: '6px',
                  '&:hover': { boxShadow: '0 0 0 1px #7c3aed' },
                }),
              }}
            />
          )}
        />
        <p className="mt-1 text-xs text-gray-500">Si no se selecciona, se asigna automáticamente al usuario que crea la factura.</p>
      </fieldset>

      {/* Ítems */}
      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaBoxOpen /> Ítems de la Factura
        </legend>

        {/* Buscador de producto */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-grow">
            <Combobox value={selectedProduct} onChange={setSelectedProduct} nullable>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaBoxOpen className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Combobox.Input
                  className="w-full rounded-md border-0 bg-white py-2.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
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
                        <Combobox.Option key={p.productId} value={p} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-purple-600 text-white' : 'text-gray-900'}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{p.productName}</span>
                            <span className="font-mono text-sm text-gray-500 font-bold ml-2">
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
          <button
            type="button"
            onClick={handleAddItem}
            disabled={!selectedProduct}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-300 font-semibold text-sm transition-colors shadow-sm"
          >
            Agregar
          </button>
        </div>

        {/* Tabla de ítems */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-48 sm:w-56 min-w-[170px] max-w-[230px]">
                  Producto
                </th>
                <th className="px-2 py-2.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-20">
                  Cant.
                </th>
                <th className="px-2 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                  P. Unit.
                </th>
                <th className="px-2 py-2.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                  Desc. ($)
                </th>
                <th className="px-2 py-2.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-32">
                  IVA (15%)
                </th>
                <th className="px-2 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                  Subtotal
                </th>
                <th className="px-2 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                  Total
                </th>
                <th className="px-2 py-2.5 text-center w-10">
                  <span className="sr-only">Eliminar</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length > 0 ? items.map((item) => {
                const itemIva = item.grabaIva ? item.subtotal * IVA_RATE : 0;
                const itemTotal = item.subtotal + itemIva;

                return (
                  <tr key={item.productId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-3 py-2.5 align-middle">
                      <div
                        className="w-48 sm:w-56 min-w-[170px] max-w-[230px] whitespace-normal break-words text-sm font-semibold text-gray-900 leading-snug"
                        title={item.productName}
                      >
                        {item.productName}
                      </div>
                    </td>

                    <td className="px-2 py-2.5 text-center align-middle">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value, 10) || 0)}
                        className="w-16 sm:w-20 rounded-lg border-gray-300 py-1 px-2 text-center text-sm font-bold focus:border-purple-500 focus:ring-purple-500 shadow-sm"
                        min="1"
                      />
                    </td>

                    <td className="px-2 py-2.5 text-right text-sm text-gray-600 font-medium whitespace-nowrap align-middle">
                      ${item.price.toFixed(2)}
                    </td>

                    <td className="px-2 py-2.5 text-center align-middle">
                      <input
                        type="number"
                        value={item.discount === 0 ? '' : item.discount}
                        onChange={(e) => handleDiscountChange(item.productId, parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-20 rounded-lg border-gray-300 py-1 px-2 text-center text-sm focus:border-purple-500 focus:ring-purple-500 font-medium shadow-sm"
                        min="0"
                        step="0.01"
                      />
                    </td>

                    <td className="px-2 py-2.5 text-center align-middle whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleIva(item.productId)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all active:scale-95 inline-flex items-center gap-1.5 shadow-sm ${
                          item.grabaIva
                            ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                        }`}
                        title={item.grabaIva ? 'Graba 15% IVA. Clic para desactivar.' : 'No graba IVA (0%). Clic para activar.'}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.grabaIva ? 'bg-purple-600 animate-pulse' : 'bg-gray-400'
                          }`}
                        />
                        {item.grabaIva ? 'Graba IVA' : 'No graba'}
                      </button>
                    </td>

                    <td className="px-2 py-2.5 text-right text-sm text-gray-700 font-medium whitespace-nowrap align-middle">
                      ${item.subtotal.toFixed(2)}
                    </td>

                    <td className="px-2 py-2.5 text-right text-sm text-gray-900 font-bold whitespace-nowrap align-middle">
                      ${itemTotal.toFixed(2)}
                    </td>

                    <td className="px-2 py-2.5 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Eliminar producto"
                      >
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400 text-sm">
                    Agrega productos a la factura usando el buscador superior
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </fieldset>

      {/* Summary Totals */}
      <div className="mt-6 border-t pt-6">
        <div className="flex justify-end">
          <div className="w-full max-w-sm bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-sm shadow-sm">
            {totals.subtotal0 > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Subtotal 0% IVA:</span>
                <span className="font-semibold text-gray-800">${totals.subtotal0.toFixed(2)}</span>
              </div>
            )}
            {totals.subtotal15 > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Subtotal 15% IVA:</span>
                <span className="font-semibold text-gray-800">${totals.subtotal15.toFixed(2)}</span>
              </div>
            )}
            {totals.totalDiscount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Descuento total:</span>
                <span className="font-bold text-rose-600">-${totals.totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>IVA (15%):</span>
              <span className="font-semibold text-gray-800">${totals.iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2.5 mt-2">
              <span className="text-gray-900">Total a Pagar:</span>
              <span className="text-purple-600 text-xl font-black">${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forma de Pago */}
      <fieldset>
        <legend className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          💳 Forma de Pago
        </legend>
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <Select
              options={paymentMethods}
              onChange={(option) => field.onChange(option?.value)}
              defaultValue={paymentMethods[0]}
              value={paymentMethods.find(m => m.value === field.value) ?? paymentMethods[0]}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: 'transparent',
                  boxShadow: '0 0 0 1px #d1d5db',
                  borderRadius: '6px',
                  '&:hover': { boxShadow: '0 0 0 1px #7c3aed' },
                }),
              }}
            />
          )}
        />
      </fieldset>
    </div>
  );
}