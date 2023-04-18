/*
  Warnings:

  - You are about to drop the column `published` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sold` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "published",
DROP COLUMN "sold";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "published" BOOLEAN DEFAULT false,
ADD COLUMN     "sold" BOOLEAN DEFAULT false;
