-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_collectionsID_fkey`;

-- AlterTable
ALTER TABLE `products` MODIFY `collectionsID` VARCHAR(191) NULL DEFAULT 'na';

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_collectionsID_fkey` FOREIGN KEY (`collectionsID`) REFERENCES `collections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
