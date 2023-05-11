-- CreateTable
CREATE TABLE `pickupstores` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phonenumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `location` VARCHAR(500) NOT NULL,
    `town` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pickupstores_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packages` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `description` JSON NOT NULL,
    `storeID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `storeID` VARCHAR(191) NOT NULL,
    `packageID` VARCHAR(191) NOT NULL,
    `paymentStatus` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pickupstores` ADD CONSTRAINT `pickupstores_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `packages` ADD CONSTRAINT `packages_storeID_fkey` FOREIGN KEY (`storeID`) REFERENCES `pickupstores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_storeID_fkey` FOREIGN KEY (`storeID`) REFERENCES `pickupstores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_packageID_fkey` FOREIGN KEY (`packageID`) REFERENCES `packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
