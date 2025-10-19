'use client';

import { FormEvent } from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { Company } from '../page';

interface CompanyFormProps {
  companyData: Company;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFormSubmit: (e: FormEvent) => void;
  isSaving: boolean;
}

export default function CompanyForm({ companyData, onFormChange, onFormSubmit, isSaving }: CompanyFormProps) {
  return (
    <form onSubmit={onFormSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Razón Social</label>
          <input type="text" id="companyName" value={companyData.companyName} onChange={onFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="companyTradeName" className="block text-sm font-medium text-gray-700">Nombre Comercial</label>
          <input type="text" id="companyTradeName" value={companyData.companyTradeName} onChange={onFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>

      <div>
        <label htmlFor="companyRuc" className="block text-sm font-medium text-gray-700">RUC</label>
        <input type="text" id="companyRuc" value={companyData.companyRuc} onChange={onFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      <div>
        <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">Dirección Matriz</label>
        <input type="text" id="companyAddress" value={companyData.companyAddress} onChange={onFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-800">Configuración SRI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label htmlFor="sriEnvironment" className="block text-sm font-medium text-gray-700">Ambiente</label>
            <select id="sriEnvironment" value={companyData.sriEnvironment} onChange={onFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="1">Pruebas</option>
              <option value="2">Producción</option>
            </select>
          </div>
          <div>
            <label htmlFor="sriCert" className="block text-sm font-medium text-gray-700">Firma Electrónica (.p12)</label>
            <input type="file" id="sriCert" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
          <div>
            <label htmlFor="sriPassword" className="block text-sm font-medium text-gray-700">Contraseña de la Firma</label>
            <input type="password" id="sriPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center w-40 gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSaving ? <FaSpinner className="animate-spin" /> : <><FaSave /> Guardar Cambios</>}
        </button>
      </div>
    </form>
  );
}