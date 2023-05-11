-- AlterTable
ALTER TABLE `shops` ADD COLUMN `rating` DOUBLE NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `services` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(1000) NOT NULL,
    `picture` VARCHAR(191) NOT NULL,
    `shopID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NOT NULL,
    `shopID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

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
    `featured` INTEGER NULL DEFAULT 3,
    `shopID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offers` ADD CONSTRAINT `offers_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
