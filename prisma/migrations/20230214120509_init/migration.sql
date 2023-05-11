/*
  Warnings:

  - Added the required column `featured` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopID` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categories` ADD COLUMN `featured` INTEGER NOT NULL,
    ADD COLUMN `picture` VARCHAR(191) NOT NULL,
    ADD COLUMN `shopID` VARCHAR(191) NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `subcategories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NOT NULL,
    `categoryID` VARCHAR(191) NOT NULL,
    `shopID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subcategories` ADD CONSTRAINT `subcategories_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subcategories` ADD CONSTRAINT `subcategories_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
