-- CreateTable
CREATE TABLE `productpictures` (
    `id` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(1000) NOT NULL,
    `shopID` VARCHAR(191) NOT NULL,
    `productID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productoptions` (
    `id` VARCHAR(191) NOT NULL,
    `option` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `shopID` VARCHAR(191) NOT NULL,
    `productID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `productpictures` ADD CONSTRAINT `productpictures_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productpictures` ADD CONSTRAINT `productpictures_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productoptions` ADD CONSTRAINT `productoptions_shopID_fkey` FOREIGN KEY (`shopID`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productoptions` ADD CONSTRAINT `productoptions_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
