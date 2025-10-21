'use client';

import { useFormContext } from 'react-hook-form';

export interface CustomerFormData {
  customerIdentificationType: string;
  customerIdentificationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
}

const identificationTypes = [
  { value: 'CEDULA', label: 'Cédula' },
  { value: 'RUC', label: 'RUC' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
  { value: 'CONSUMIDOR_FINAL', label: 'Consumidor Final' },
];

export default function NewCustomerForm() {
  const { register, formState: { errors } } = useFormContext<CustomerFormData>();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customerIdentificationType" className="block text-sm font-semibold text-gray-800 mb-1">
            Tipo de Identificación
          </label>
          <select
            id="customerIdentificationType"
            {...register('customerIdentificationType')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
          >
            {identificationTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="customerIdentificationNumber" className="block text-sm font-semibold text-gray-800 mb-1">
            Número de Identificación
          </label>
          <input
            type="text"
            id="customerIdentificationNumber"
            {...register('customerIdentificationNumber', { required: 'Este campo es obligatorio' })}
            className={`w-full px-4 py-2 border rounded-lg outline-none transition ${errors.customerIdentificationNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
          />
          {errors.customerIdentificationNumber && <p className="text-red-500 text-xs mt-1">{errors.customerIdentificationNumber.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="customerName" className="block text-sm font-semibold text-gray-800 mb-1">
          Nombre / Razón Social
        </label>
        <input
          type="text"
          id="customerName"
          {...register('customerName', { required: 'Este campo es obligatorio' })}
          className={`w-full px-4 py-2 border rounded-lg outline-none transition ${errors.customerName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
        />
        {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-semibold text-gray-800 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="customerEmail"
            {...register('customerEmail', {
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo electrónico no válido'
              }
            })}
            className={`w-full px-4 py-2 border rounded-lg outline-none transition ${errors.customerEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
          />
          {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>}
        </div>
        <div>
          <label htmlFor="customerPhone" className="block text-sm font-semibold text-gray-800 mb-1">
            Teléfono (Opcional)
          </label>
          <input
            type="text"
            id="customerPhone"
            {...register('customerPhone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="customerAddress" className="block text-sm font-semibold text-gray-800 mb-1">
          Dirección (Opcional)
        </label>
        <textarea
          id="customerAddress"
          {...register('customerAddress')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>
    </div>
  );
}