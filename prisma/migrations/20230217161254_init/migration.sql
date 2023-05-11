/*
  Warnings:

  - You are about to alter the column `featured` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `featured` on the `offers` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `featuredHome` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `featuredCategory` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `categories` MODIFY `featured` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `offers` MODIFY `featured` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `products` MODIFY `featuredHome` BOOLEAN NULL DEFAULT false,
    MODIFY `featuredCategory` BOOLEAN NULL DEFAULT false;
