/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Invoice" DROP CONSTRAINT "Invoice_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SaleNote" DROP CONSTRAINT "SaleNote_customerId_fkey";

-- AlterTable
ALTER TABLE "public"."Customer" DROP CONSTRAINT "Customer_pkey",
ALTER COLUMN "customerId" DROP DEFAULT,
ALTER COLUMN "customerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("customerId");
DROP SEQUENCE "Customer_customerId_seq";

-- AlterTable
ALTER TABLE "public"."Invoice" ALTER COLUMN "customerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."SaleNote" ALTER COLUMN "customerId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."SaleNote" ADD CONSTRAINT "SaleNote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;
