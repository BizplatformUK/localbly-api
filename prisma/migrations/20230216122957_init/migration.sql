/*
  Warnings:

  - You are about to drop the column `couponCode` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `discountPrice` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `couponCode`,
    DROP COLUMN `discountPrice`;
