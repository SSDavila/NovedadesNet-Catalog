/*
  Warnings:

  - You are about to drop the column `productPreviousPrice` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "productPreviousPrice",
ADD COLUMN     "productOfferPrice" DECIMAL(10,2);
