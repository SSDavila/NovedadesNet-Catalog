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

-- CreateTable
CREATE TABLE "public"."Product" (
    "prodId" TEXT NOT NULL,
    "prodName" TEXT NOT NULL,
    "prodDescription" TEXT,
    "prodPrice" DECIMAL(10,2) NOT NULL,
    "prodPreviousPrice" DECIMAL(10,2),
    "prodCategory" TEXT,
    "prodStock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("prodId")
);

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "prodImageId" SERIAL NOT NULL,
    "prodImageUrl" TEXT NOT NULL,
    "prodImagePublicid" TEXT NOT NULL,
    "prodId" TEXT NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("prodImageId")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "categoryId" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryAbbreviation" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "public"."User"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_prodImagePublicid_key" ON "public"."ProductImage"("prodImagePublicid");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryName_key" ON "public"."Category"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryAbbreviation_key" ON "public"."Category"("categoryAbbreviation");

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_prodId_fkey" FOREIGN KEY ("prodId") REFERENCES "public"."Product"("prodId") ON DELETE CASCADE ON UPDATE CASCADE;
