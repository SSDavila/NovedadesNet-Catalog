'use client';

import { useState, useEffect, FormEvent } from 'react';
import { FaBuilding } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/constants';
import CompanyForm from './components/CompanyForm';
import { useNotification } from '@/components/Notifications/NotificationContext';
import { Company } from '@/interfaces';

const initialCompanyState: Company = {
  id: 1,
  companyName: '',
  companyTradeName: '',
  companyRuc: '',
  companyAddress: '',
  companyObligedToAccount: 'NO',
  sriEnvironment: 1,
  sriPassword: '',
  sriCert: null,
};

export default function CompanyPage() {
  const [companyData, setCompanyData] = useState<Company>(initialCompanyState);
  const [file, setFile] = useState<File | null>(null);
  const { addNotification } = useNotification();
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
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/company`, {
        method: 'PATCH',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al guardar los cambios.' }));
        throw new Error(errorData.message || 'Error al guardar los cambios.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyInfo'] });
      addNotification('¡Información guardada con éxito!', 'success');
    },
    onError: (err: Error) => {
      addNotification(err.message, 'error');
    },
  });

  useEffect(() => {
    if (data) {
      setCompanyData(data);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;

    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const selectedFile = files[0];
        if (!selectedFile.name.endsWith('.p12')) {
          addNotification('Archivo subido no válido. Por favor, seleccione un archivo con la extensión .p12', 'error');
          (e.target as HTMLInputElement).value = '';
          setFile(null);
        } else {
          setFile(selectedFile);
        }
      } else {
        setFile(null);
      }
    } else {
      const processedValue = id === 'sriEnvironment' ? parseInt(value, 10) : value;
      setCompanyData(prev => ({ ...prev, [id]: processedValue }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (file && (!companyData.sriPassword || companyData.sriPassword.trim() === '')) {
      addNotification('Si sube un archivo de firma electrónica, debe proporcionar la contraseña.', 'warning');
      return; 
    }

    if (companyData.sriPassword && companyData.sriPassword.trim() !== '' && !file) {
      addNotification('Si proporciona una contraseña para la firma, también debe subir el archivo .p12 correspondiente.', 'warning');
      return; 
    }
    
    const formData = new FormData();
    formData.append('companyName', companyData.companyName);
    formData.append('companyTradeName', companyData.companyTradeName);
    formData.append('companyRuc', companyData.companyRuc);
    formData.append('companyAddress', companyData.companyAddress);
    formData.append('companyObligedToAccount', companyData.companyObligedToAccount);
    formData.append('sriEnvironment', String(companyData.sriEnvironment));
    if (companyData.sriPassword) {
      formData.append('sriPassword', companyData.sriPassword);
    }
    if (file) {
      formData.append('sriCert', file);
    }

    updateCompanyMutation.mutate(formData);
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
