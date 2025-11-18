/*
  Warnings:

  - You are about to drop the column `invoiceEmailed` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceSriAuthorization` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "invoiceEmailed",
DROP COLUMN "invoiceSriAuthorization",
ADD COLUMN     "invoiceSriAuthorizationDateTime" TIMESTAMP(3),
ADD COLUMN     "invoiceSriAuthorizationNumber" TEXT;
