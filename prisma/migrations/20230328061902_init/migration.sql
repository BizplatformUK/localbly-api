-- AlterTable
ALTER TABLE `products` ADD COLUMN `collectionsID` VARCHAR(191) NOT NULL DEFAULT 'na';

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_collectionsID_fkey` FOREIGN KEY (`collectionsID`) REFERENCES `collections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
