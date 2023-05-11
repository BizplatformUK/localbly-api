/*
  Warnings:

  - You are about to drop the column `shopName` on the `shops` table. All the data in the column will be lost.
  - Added the required column `name` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shops` DROP COLUMN `shopName`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
