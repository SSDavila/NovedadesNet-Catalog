/*
  Warnings:

  - A unique constraint covering the columns `[documentType,establishmentCode,emissionPointCode]` on the table `SequenceControl` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SequenceControl_documentType_establishmentCode_emissionPoin_key" ON "public"."SequenceControl"("documentType", "establishmentCode", "emissionPointCode");
