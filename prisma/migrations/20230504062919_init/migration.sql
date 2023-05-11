-- CreateTable
CREATE TABLE `banner` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `shopID` VARCHAR(191) NOT NULL,
    `itemID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `banner` ADD CONSTRAINT `banner_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
