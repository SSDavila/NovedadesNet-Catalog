-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "companyEmissionPointCode" TEXT DEFAULT '001',
ADD COLUMN     "companyEstablishmentCode" TEXT DEFAULT '001';
