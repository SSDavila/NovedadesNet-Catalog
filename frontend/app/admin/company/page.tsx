'use client';

import { useState, useEffect, FormEvent } from 'react';
import { FaBuilding } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/constants';
import CompanyForm from './components/CompanyForm';

export interface Company {
  id: number;
  companyName: string;
  companyTradeName: string;
  companyRuc: string;
  companyAddress: string;
  sriEnvironment: number;
}

const initialCompanyState: Company = {
  id: 1,
  companyName: '',
  companyTradeName: '',
  companyRuc: '',
  companyAddress: '',
  sriEnvironment: 1,
};

export default function CompanyPage() {
  const [companyData, setCompanyData] = useState<Company>(initialCompanyState);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Company>({
    queryKey: ['companyInfo'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/company`);

      if (!response.ok) {
        return null;
      }
      return response.json();
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async (updatedData: Partial<Company>) => {
      const response = await fetch(`${API_BASE_URL}/company`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar los cambios.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyInfo'] });

      alert('¡Información guardada con éxito!');
    },
    onError: (err: Error) => {
      console.error('Error al guardar:', err);
      alert(`Error: ${err.message}`);
    },
  });

  useEffect(() => {
    if (data) {
      setCompanyData(data);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    const processedValue = id === 'sriEnvironment' ? parseInt(value, 10) : value;
    setCompanyData(prev => ({ ...prev, [id]: processedValue }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { id, ...updateData } = companyData;
    updateCompanyMutation.mutate(updateData);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Cargando información de la empresa...</div>;
  }

  return (
    <div className="p-6 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaBuilding />
          Información de la Empresa
        </h1>
        <p className="text-gray-600 mt-1">Configura los datos que aparecerán en tus facturas y documentos.</p>
      </header>

      <main className="max-w-4xl">
        <CompanyForm
          companyData={companyData}
          onFormChange={handleChange}
          onFormSubmit={handleSubmit}
          isSaving={updateCompanyMutation.isPending}
        />
      </main>
    </div>
  );
}
