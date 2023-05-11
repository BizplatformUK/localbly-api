/*
  Warnings:

  - You are about to alter the column `options` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `options` JSON NOT NULL;
