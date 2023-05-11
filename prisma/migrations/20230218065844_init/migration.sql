/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_shopID_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_categoryID_fkey`;

-- DropForeignKey
ALTER TABLE `subcategories` DROP FOREIGN KEY `subcategories_categoryID_fkey`;

-- DropTable
DROP TABLE `categories`;
