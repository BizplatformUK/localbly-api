-- AlterTable
ALTER TABLE `clients` ADD COLUMN `clientType` ENUM('Corporate', 'Individual') NOT NULL DEFAULT 'Individual';
