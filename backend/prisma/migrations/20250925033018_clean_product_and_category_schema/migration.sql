/*
  Warnings:

  - The primary key for the `ProductImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `prodId` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prodImageUrl` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- AlterTable
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_pkey",
DROP COLUMN "id",
DROP COLUMN "productId",
DROP COLUMN "url",
ADD COLUMN     "prodId" TEXT NOT NULL,
ADD COLUMN     "prodImageId" SERIAL NOT NULL,
ADD COLUMN     "prodImageUrl" TEXT NOT NULL,
ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("prodImageId");

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_prodId_fkey" FOREIGN KEY ("prodId") REFERENCES "public"."Product"("prodId") ON DELETE CASCADE ON UPDATE CASCADE;
