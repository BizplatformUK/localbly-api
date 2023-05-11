/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userID` on the `users` table. All the data in the column will be lost.
  - Added the required column `id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pickupstores` DROP FOREIGN KEY `pickupstores_userID_fkey`;

-- DropForeignKey
ALTER TABLE `shops` DROP FOREIGN KEY `shops_ownerID_fkey`;

-- DropForeignKey
ALTER TABLE `subscriptions` DROP FOREIGN KEY `subscriptions_userID_fkey`;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `userID`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `shops` ADD CONSTRAINT `shops_ownerID_fkey` FOREIGN KEY (`ownerID`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pickupstores` ADD CONSTRAINT `pickupstores_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
