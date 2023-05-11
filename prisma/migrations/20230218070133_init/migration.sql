/*
  Warnings:

  - You are about to drop the `offers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `offers` DROP FOREIGN KEY `offers_shopID_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_offerID_fkey`;

-- DropIndex
DROP INDEX `products_categoryID_fkey` ON `products`;

-- DropIndex
DROP INDEX `subcategories_categoryID_fkey` ON `subcategories`;

-- DropTable
DROP TABLE `offers`;
