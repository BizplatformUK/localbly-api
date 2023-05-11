-- CreateTable
CREATE TABLE `users` (
    `userID` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `number` BIGINT NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `resetToken` VARCHAR(191) NOT NULL DEFAULT 'na',
    `role` VARCHAR(191) NOT NULL DEFAULT 'super-admin',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shops` (
    `id` VARCHAR(191) NOT NULL,
    `shopName` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `haveWebsite` VARCHAR(191) NOT NULL,
    `town` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL DEFAULT 'free',
    `sellingOn` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `ownerID` VARCHAR(191) NOT NULL,
    `phoneNumbers` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shops` ADD CONSTRAINT `shops_ownerID_fkey` FOREIGN KEY (`ownerID`) REFERENCES `users`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;
