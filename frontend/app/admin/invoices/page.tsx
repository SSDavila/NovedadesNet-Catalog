'use client';

import { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';
import { useInvoices } from './hooks/useInvoices';
import { InvoiceFormData } from './components/NewInvoiceModal';
import { Invoice } from '@/interfaces/invoice';

import InvoiceList from './components/InvoiceList';
import InvoiceDetailModal from './components/InvoiceDetailModal';
import NewInvoiceModal from './components/NewInvoiceModal';
import InvoiceDashboard from './components/InvoiceDashboard';

export default function InvoicesPage() {
  // Estado para manejar la visibilidad de los modales
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  // Estado para asegurar que el código solo se ejecute en el cliente
  const [isClient, setIsClient] = useState(false);

  // Hook central que maneja toda la lógica de datos
  const {
    invoices,
    isLoadingInvoices,
    isErrorInvoices,
    errorInvoices,
    createInvoice,
    isCreatingInvoice,
    processingInvoiceId,
    authorizeInvoice,
    printInvoice,
    downloadXml,
    sendEmail,
  } = useInvoices();

  // Efecto para establecer que estamos en el lado del cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Manejador central para todas las acciones de la lista de facturas
  const handleAction = (action: string, invoiceId: number) => {
    const invoice = invoices.find((inv) => inv.invoiceId === invoiceId);
    if (!invoice) return;

    switch (action) {
      case 'view':
        setSelectedInvoice(invoice);
        break;
      case 'authorize':
        authorizeInvoice(invoiceId);
        break;
      case 'print':
        printInvoice(invoiceId); // Lógica a implementar
        break;
      case 'downloadXml':
        downloadXml(invoiceId); // Lógica a implementar
        break;
      case 'sendEmail':
        sendEmail(invoiceId); // Lógica a implementar
        break;
    }
  };

  // Manejador para la creación de la factura
  const handleCreateAndClose = (data: InvoiceFormData) => {
    // Transformamos los datos para que coincidan con el DTO del backend.
    // El backend solo necesita el ID del producto, la cantidad y el descuento por cada ítem.
    const payloadForBackend = {
      customerId: data.customerId,
      paymentMethod: data.paymentMethod,
      items: data.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        discount: item.discount,
      })),
    };
    createInvoice(payloadForBackend, {

      onSuccess: () => {
        // La lógica de sondeo ya se inicia en el hook.
        // Aquí solo cerramos el modal.
        setIsNewInvoiceModalOpen(false);
      },
      onError: (error) => {
        // Opcional: Mostrar un toast o alerta de error
        alert(`Error al crear la factura: ${error.message}`);
      },
    });
  };

  // Renderizado del contenido principal
  const renderMainContent = () => {
    if (!isClient || isLoadingInvoices) {
      return <div className="text-center p-8">Cargando facturas...</div>;
    }
    if (isErrorInvoices) {
      return <div className="p-8 text-center text-red-600">Error: {(errorInvoices as Error).message}</div>;
    }
    return (
      <InvoiceList
        invoices={invoices}
        onAction={handleAction}
        processingInvoiceId={processingInvoiceId}
      />
    );
  };

  return (
    <div className="p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><FaFileInvoiceDollar /> Facturación</h1>
        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus /> Nueva Factura
        </button>
      </header>

      <main>
        <InvoiceDashboard invoices={invoices} isLoading={!isClient || isLoadingInvoices} />
        {renderMainContent()}
      </main>

      <NewInvoiceModal
        isOpen={isNewInvoiceModalOpen}
        onClose={() => setIsNewInvoiceModalOpen(false)}
        onSubmit={handleCreateAndClose}
        isSubmitting={isCreatingInvoice}
      />

      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
