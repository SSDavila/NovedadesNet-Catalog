'use client';

import { useState, useEffect } from 'react';
import { Invoice } from '@/interfaces/invoice';
import { FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';
import InvoiceList from './components/InvoiceList';
import InvoiceDetailModal from './components/InvoiceDetailModal';
import NewInvoiceModal from './components/NewInvoiceModal';
import { InvoiceFormData } from './components/NewInvoiceModal';
import InvoiceDashboard from './components/InvoiceDashboard';
import { useInvoices } from './hooks/useInvoices';

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const {
    invoices,
    isLoading,
    isError,
    error,
    createInvoice,
    isCreatingInvoice,
    authorizeInvoice,
    isAuthorizingInvoice,
    printInvoice,
    isPrintingInvoice,
    downloadXml,
    isDownloadingXml,
    sendEmail,
    isSendingEmail,
  } = useInvoices();

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find((inv: { invoiceId: { toString: () => string; }; }) => inv.invoiceId.toString() === invoiceId);
    setSelectedInvoice(invoice || null);
  };

  const handleAction = (action: string, invoiceId: string) => {
    const invoice = invoices.find((inv: { invoiceId: { toString: () => string; }; }) => inv.invoiceId.toString() === invoiceId);
    if (!invoice) return;

    switch (action) {
      case 'view':
        handleViewInvoice(invoiceId);
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

  if (isError) return <div className="p-8 text-center text-red-600">Error: {(error as Error).message}</div>;

  return (
    <div className="p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaFileInvoiceDollar />
            Facturación
          </h1>
          <p className="text-gray-600 mt-1">Crea y administra tus facturas electrónicas.</p>
        </div>
        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Nueva Factura
        </button>
      </header>

      <main>
        <InvoiceDashboard invoices={invoices} isLoading={isLoading} />
        <InvoiceList
          invoices={invoices.map(inv => ({
            id: inv.invoiceId.toString(),
            invoiceNumber: inv.invoiceNumber,
            customerName: inv.customer.customerName,
            total: inv.invoiceTotal,
            status: inv.invoiceStatus,
            date: new Date(inv.invoiceCreatedAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }),
          }))}
          onAction={handleAction}
          isLoading={isLoading}
          isAuthorizing={isAuthorizingInvoice}
          isPrinting={isPrintingInvoice}
          isDownloadingXml={isDownloadingXml}
          isSendingEmail={isSendingEmail}
        />
      </main>
      <NewInvoiceModal
        isOpen={isNewInvoiceModalOpen}
        onClose={() => setIsNewInvoiceModalOpen(false)}
        onSubmit={(data) => createInvoice(data)}
        isSubmitting={isCreatingInvoice}
      />
      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
