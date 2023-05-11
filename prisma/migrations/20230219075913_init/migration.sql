-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_offerID_fkey`;

-- AlterTable
ALTER TABLE `products` MODIFY `offerID` VARCHAR(191) NULL DEFAULT 'na';

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_offerID_fkey` FOREIGN KEY (`offerID`) REFERENCES `offers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
