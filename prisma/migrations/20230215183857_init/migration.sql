-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `categoryID` VARCHAR(191) NOT NULL,
    `subcategoryID` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `featuredHome` INTEGER NULL DEFAULT 3,
    `featuredCategory` INTEGER NULL DEFAULT 3,
    `description` VARCHAR(191) NOT NULL,
    `options` VARCHAR(191) NOT NULL,
    `tags` VARCHAR(1000) NOT NULL,
    `offerID` VARCHAR(191) NULL,
    `rating` DOUBLE NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `productID` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `review` VARCHAR(1000) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shoptypes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subcategoryID_fkey` FOREIGN KEY (`subcategoryID`) REFERENCES `subcategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_offerID_fkey` FOREIGN KEY (`offerID`) REFERENCES `offers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
