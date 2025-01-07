/*
  Warnings:

  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- DropIndex
DROP INDEX `User_phone_key` ON `user`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `photo` VARCHAR(191) NULL,
    MODIFY `role` ENUM('User', 'Doctor') NOT NULL,
    MODIFY `password` VARCHAR(191) NULL;
