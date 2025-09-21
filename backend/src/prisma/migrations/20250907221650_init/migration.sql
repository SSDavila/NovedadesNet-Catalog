-- CreateTable
CREATE TABLE "public"."Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ProductoCategorias" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductoCategorias_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductoCategorias_B_index" ON "public"."_ProductoCategorias"("B");

-- AddForeignKey
ALTER TABLE "public"."_ProductoCategorias" ADD CONSTRAINT "_ProductoCategorias_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProductoCategorias" ADD CONSTRAINT "_ProductoCategorias_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
