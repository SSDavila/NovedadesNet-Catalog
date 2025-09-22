-- CreateTable
CREATE TABLE "public"."Category" (
    "categoryId" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryName_key" ON "public"."Category"("categoryName");
