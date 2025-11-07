-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "companyObligedToAccount" TEXT NOT NULL DEFAULT 'NO';

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "productIvaRate" TEXT NOT NULL DEFAULT '0';
