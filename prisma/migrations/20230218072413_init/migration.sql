/*
  Warnings:

  - Made the column `offerID` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `products_offerID_fkey` ON `products`;

-- AlterTable
ALTER TABLE `products` MODIFY `offerID` VARCHAR(191) NOT NULL DEFAULT 'na';

-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NOT NULL,
    `featured` BOOLEAN NULL DEFAULT false,
    `shopID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(1000) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `discount` INTEGER NOT NULL,
    `couponCode` VARCHAR(191) NULL DEFAULT 'na',
    `quantity` INTEGER NULL DEFAULT 0,
    `picture` VARCHAR(191) NOT NULL,
    `validFrom` DATETIME(3) NOT NULL,
    `validTo` DATETIME(3) NOT NULL,
    `featured` BOOLEAN NULL DEFAULT false,
    `shopID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subcategories` ADD CONSTRAINT `subcategories_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offers` ADD CONSTRAINT `offers_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_offerID_fkey` FOREIGN KEY (`offerID`) REFERENCES `offers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
