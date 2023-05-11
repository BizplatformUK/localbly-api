/*
  Warnings:

  - You are about to drop the column `haveWebsite` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `shops` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `shops` DROP COLUMN `haveWebsite`,
    DROP COLUMN `type`,
    ADD COLUMN `typeID` VARCHAR(191) NOT NULL DEFAULT 'na';

-- AddForeignKey
ALTER TABLE `shops` ADD CONSTRAINT `shops_typeID_fkey` FOREIGN KEY (`typeID`) REFERENCES `shoptypes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
