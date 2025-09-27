/*
  Warnings:

  - You are about to drop the column `prodDesc` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `prodImages` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "prodDesc",
DROP COLUMN "prodImages",
ADD COLUMN     "prodDescription" TEXT;

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("prodId") ON DELETE CASCADE ON UPDATE CASCADE;
