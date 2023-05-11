/*
  Warnings:

  - Added the required column `shopID` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `shopID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
