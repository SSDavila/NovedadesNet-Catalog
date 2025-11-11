import { Customer, User } from '.';

export interface InvoiceItem {
  invoiceItemId: number;
  invoiceItemQuantity: number;
  invoiceItemUnitPrice: number;
  invoiceItemDiscount: number;
  invoiceItemSubtotal: number;
  product: {
    productName: string;
    productSku: string | null;
  };
}

export interface Invoice {
  invoiceId: number;
  invoiceNumber: string;
  invoiceAccessKey: string;
  invoiceStatus: 'AUTORIZADA' | 'PENDIENTE' | 'ANULADA' | 'RECHAZADA' | string;
  invoiceSubtotal: number;
  invoiceTax: number;
  invoiceDiscountTotal: number;
  invoiceTotal: number;
  invoicePaymentMethod: string;
  invoiceSriAuthorization?: string | null;
  invoiceSriResponse?: string | null;
  invoiceSignedXml?: string | null;
  invoiceCreatedAt: string;
  invoiceUpdatedAt: string;
  customer: Customer;
  seller: User;
  items: InvoiceItem[];
}