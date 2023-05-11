/*
  Warnings:

  - Added the required column `picture` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `onSale` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `picture` VARCHAR(1000) NOT NULL,
    ADD COLUMN `salePrice` INTEGER NOT NULL DEFAULT 0;
