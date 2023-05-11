/*
  Warnings:

  - Added the required column `link` to the `banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `banner` ADD COLUMN `link` VARCHAR(191) NOT NULL;
