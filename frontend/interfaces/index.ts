export interface ProductImage {
  productImageId: string;
  productImageUrl: string;
  productImagePublicId: string;
}

export interface Category {
  categoryId: string;
  categoryName: string;
}

export interface Product {
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  categoryId: string;
  category: {
    categoryName: string;
  };
  images: ProductImage[];
}

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  userIsActive: boolean;
}

export interface Company {
  id: number;
  companyName: string;
  companyTradeName: string;
  companyRuc: string;
  companyAddress: string;
  sriEnvironment: number;
  sriPassword?: string;
  sriCert?: File | null;
}

export interface Customer {
  customerId: string;
  customerIdentificationType?: string;
  customerIdentificationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCreatedAt: string;
  customerUpdatedAt: string;
}

export interface SaleNote {
  saleNoteId: number;
  saleNoteNumber: string;
  saleNoteStatus: string;
  saleNoteTotal: number;
  saleNoteCreatedAt: string;
  customer: {
    customerName: string;
  };
  seller: {
    userName: string;
  };
  items?: {
    saleNoteItemId: number;
    saleNoteItemQuantity: number;
    saleNoteItemUnitPrice: number;
    product: {
      productName: string;
      productSku: string | null;
    };
  }[];
}

export interface ProductStock {
  productId: string;
  productName: string;
  productSku: string | null;
  productStock: number;
  category: {
    categoryName: string;
  } | null;
}

export interface InventoryMovement {
  inventoryMovementId: number;
  inventoryMovementType: string;
  inventoryMovementQuantity: number;
  inventoryMovementReason: string | null;
  inventoryMovementCreatedAt: string;
  product: {
    productName: string;
    productSku: string | null;
  };
  user: {
    userName: string;
  };
}