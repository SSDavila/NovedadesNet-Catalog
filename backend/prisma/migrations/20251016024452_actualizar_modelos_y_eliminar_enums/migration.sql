-- CreateTable
CREATE TABLE "public"."User" (
    "userId" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "userRole" TEXT NOT NULL DEFAULT 'VENDEDOR',
    "userIsActive" BOOLEAN NOT NULL DEFAULT true,
    "userCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "companyId" SERIAL NOT NULL,
    "companyRuc" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyTradeName" TEXT,
    "companyAddress" TEXT NOT NULL,
    "companyPhone" TEXT,
    "companyEmail" TEXT,
    "companyLogoUrl" TEXT,
    "sriEnvironment" TEXT NOT NULL DEFAULT '1',
    "sriEmissionType" TEXT NOT NULL DEFAULT '1',
    "sriCertificatePath" TEXT,
    "sriCertificatePassword" TEXT,
    "companyCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("companyId")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "customerId" SERIAL NOT NULL,
    "customerIdentificationType" TEXT NOT NULL DEFAULT 'CONSUMIDOR_FINAL',
    "customerIdentificationNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerAddress" TEXT,
    "customerCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerUpdatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productDescription" TEXT,
    "productSku" TEXT,
    "productBarcode" TEXT,
    "productPrice" DECIMAL(10,2) NOT NULL,
    "productPreviousPrice" DECIMAL(10,2),
    "productCost" DECIMAL(10,2),
    "productStock" INTEGER NOT NULL DEFAULT 0,
    "productLowStockThreshold" INTEGER DEFAULT 5,
    "productCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productUpdatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "productImageId" TEXT NOT NULL,
    "productImageUrl" TEXT NOT NULL,
    "productImagePublicId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("productImageId")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryAbbreviation" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "public"."InventoryMovement" (
    "inventoryMovementId" SERIAL NOT NULL,
    "inventoryMovementType" TEXT NOT NULL,
    "inventoryMovementQuantity" INTEGER NOT NULL,
    "inventoryMovementReason" TEXT,
    "inventoryMovementCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    "saleNoteId" INTEGER,
    "invoiceId" INTEGER,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("inventoryMovementId")
);

-- CreateTable
CREATE TABLE "public"."SaleNote" (
    "saleNoteId" SERIAL NOT NULL,
    "saleNoteNumber" TEXT NOT NULL,
    "saleNoteStatus" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "saleNoteTotal" DECIMAL(10,2) NOT NULL,
    "saleNoteCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saleNoteUpdatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,

    CONSTRAINT "SaleNote_pkey" PRIMARY KEY ("saleNoteId")
);

-- CreateTable
CREATE TABLE "public"."SaleNoteItem" (
    "saleNoteItemId" SERIAL NOT NULL,
    "saleNoteItemQuantity" INTEGER NOT NULL,
    "saleNoteItemUnitPrice" DECIMAL(10,2) NOT NULL,
    "saleNoteItemSubtotal" DECIMAL(10,2) NOT NULL,
    "saleNoteId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "SaleNoteItem_pkey" PRIMARY KEY ("saleNoteItemId")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "invoiceId" SERIAL NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceAccessKey" TEXT NOT NULL,
    "invoiceStatus" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "invoiceSubtotal" DECIMAL(10,2) NOT NULL,
    "invoiceTax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "invoiceDiscountTotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "invoiceTotal" DECIMAL(10,2) NOT NULL,
    "invoiceSriAuthorization" TEXT,
    "invoiceSriResponse" TEXT,
    "invoiceCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoiceUpdatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "saleNoteId" INTEGER,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("invoiceId")
);

-- CreateTable
CREATE TABLE "public"."InvoiceItem" (
    "invoiceItemId" SERIAL NOT NULL,
    "invoiceItemQuantity" INTEGER NOT NULL,
    "invoiceItemUnitPrice" DECIMAL(10,2) NOT NULL,
    "invoiceItemDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "invoiceItemSubtotal" DECIMAL(10,2) NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("invoiceItemId")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "paymentId" SERIAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentAmount" DECIMAL(10,2) NOT NULL,
    "paymentReference" TEXT,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "public"."SequenceControl" (
    "sequenceId" SERIAL NOT NULL,
    "documentType" TEXT NOT NULL,
    "establishmentCode" TEXT NOT NULL,
    "emissionPointCode" TEXT NOT NULL,
    "currentNumber" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SequenceControl_pkey" PRIMARY KEY ("sequenceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "public"."User"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyRuc_key" ON "public"."Company"("companyRuc");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerIdentificationNumber_key" ON "public"."Customer"("customerIdentificationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "public"."Customer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_productSku_key" ON "public"."Product"("productSku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_productBarcode_key" ON "public"."Product"("productBarcode");

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_productImagePublicId_key" ON "public"."ProductImage"("productImagePublicId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryName_key" ON "public"."Category"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryAbbreviation_key" ON "public"."Category"("categoryAbbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "SaleNote_saleNoteNumber_key" ON "public"."SaleNote"("saleNoteNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "public"."Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceAccessKey_key" ON "public"."Invoice"("invoiceAccessKey");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_saleNoteId_key" ON "public"."Invoice"("saleNoteId");

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("categoryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_saleNoteId_fkey" FOREIGN KEY ("saleNoteId") REFERENCES "public"."SaleNote"("saleNoteId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("invoiceId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleNote" ADD CONSTRAINT "SaleNote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleNote" ADD CONSTRAINT "SaleNote_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleNoteItem" ADD CONSTRAINT "SaleNoteItem_saleNoteId_fkey" FOREIGN KEY ("saleNoteId") REFERENCES "public"."SaleNote"("saleNoteId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleNoteItem" ADD CONSTRAINT "SaleNoteItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_saleNoteId_fkey" FOREIGN KEY ("saleNoteId") REFERENCES "public"."SaleNote"("saleNoteId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("invoiceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoiceItem" ADD CONSTRAINT "InvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("invoiceId") ON DELETE CASCADE ON UPDATE CASCADE;
