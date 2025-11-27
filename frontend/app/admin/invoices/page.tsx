'use client';

import { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';
import { useInvoices } from './hooks/useInvoices';
import { InvoiceFormData } from './components/NewInvoiceModal';
import { Invoice } from '@/interfaces/invoice';
import { AnimatePresence } from 'framer-motion';

import InvoiceList from './components/InvoiceList';
import InvoiceDetailModal from './components/InvoiceDetailModal';
import NewInvoiceModal from './components/NewInvoiceModal';
import InvoiceDashboard from './components/InvoiceDashboard';

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAction = (action: string, invoiceId: number) => {
    const invoice = invoices.find((inv: { invoiceId: number; }) => inv.invoiceId === invoiceId);
    if (!invoice) return;

    switch (action) {
      case 'view':
        setSelectedInvoice(invoice);
        break;
      case 'authorize':
        authorizeInvoice(invoiceId);
        break;
      case 'print':
        printInvoice(invoiceId); 
        break;
      case 'downloadXml':
        downloadXml(invoiceId);
        break;
      case 'sendEmail':
        sendEmail(invoiceId); 
        break;
    }
  };

  const handleCreateAndClose = (data: InvoiceFormData) => {

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
        setIsNewInvoiceModalOpen(false);
      },
      onError: (error) => {
        alert(`Error al crear la factura: ${error.message}`);
      },
    });
  };

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

      <AnimatePresence>
        {isNewInvoiceModalOpen && (
          <NewInvoiceModal
            isOpen={isNewInvoiceModalOpen}
            onClose={() => setIsNewInvoiceModalOpen(false)}
            onSubmit={handleCreateAndClose}
            isSubmitting={isCreatingInvoice}
          />
        )}
      </AnimatePresence>

      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
