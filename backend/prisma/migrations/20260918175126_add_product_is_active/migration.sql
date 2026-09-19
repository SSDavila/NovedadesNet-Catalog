-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productIsActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userLastName" TEXT;

-- CreateTable
CREATE TABLE "SellerProductCommission" (
    "userId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "commission" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "SellerProductCommission_pkey" PRIMARY KEY ("userId","productId")
);

-- CreateIndex
CREATE INDEX "Product_productCreatedAt_idx" ON "Product"("productCreatedAt");

-- CreateIndex
CREATE INDEX "SaleNote_saleNoteCreatedAt_idx" ON "SaleNote"("saleNoteCreatedAt");

-- CreateIndex
CREATE INDEX "SaleNote_sellerId_idx" ON "SaleNote"("sellerId");

-- AddForeignKey
ALTER TABLE "SellerProductCommission" ADD CONSTRAINT "SellerProductCommission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerProductCommission" ADD CONSTRAINT "SellerProductCommission_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;
