/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Producto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductoCategorias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ProductoCategorias" DROP CONSTRAINT "_ProductoCategorias_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProductoCategorias" DROP CONSTRAINT "_ProductoCategorias_B_fkey";

-- DropTable
DROP TABLE "public"."Categoria";

-- DropTable
DROP TABLE "public"."Producto";

-- DropTable
DROP TABLE "public"."_ProductoCategorias";

-- CreateTable
CREATE TABLE "public"."User" (
    "userId" SERIAL NOT NULL,
    "userType" TEXT NOT NULL DEFAULT 'customer',
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "public"."User"("userEmail");
