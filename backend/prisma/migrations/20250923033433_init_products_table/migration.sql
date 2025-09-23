-- CreateTable
CREATE TABLE "public"."Product" (
    "prodId" TEXT NOT NULL,
    "prodName" TEXT NOT NULL,
    "prodDesc" TEXT,
    "prodPrice" DECIMAL(10,2) NOT NULL,
    "prodImages" TEXT[],
    "prodStock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("prodId")
);
