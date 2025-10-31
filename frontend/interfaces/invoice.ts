export interface Invoice {
  invoiceId: number;
  invoiceNumber: string;
  customer: {
    customerName: string;
  };
  invoiceTotal: number;
  invoiceStatus: 'AUTORIZADA' | 'PENDIENTE' | 'ANULADA' | 'RECHAZADA';
  invoiceCreatedAt: string;
}