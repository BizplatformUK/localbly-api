-- AlterTable
ALTER TABLE `pickupstores` ADD COLUMN `emailHost` VARCHAR(191) NULL,
    ADD COLUMN `emailPort` INTEGER NULL,
    ADD COLUMN `emailUser` VARCHAR(191) NULL;
