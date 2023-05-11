-- AlterTable
ALTER TABLE `subscriptions` ADD COLUMN `CheckoutRequestID` VARCHAR(191) NULL DEFAULT 'na',
    ADD COLUMN `mpesaPhoneNumber` VARCHAR(191) NOT NULL DEFAULT '0',
    ADD COLUMN `receipt` VARCHAR(191) NULL DEFAULT 'na';
