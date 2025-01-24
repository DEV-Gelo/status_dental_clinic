/*
  Warnings:

  - You are about to drop the column `specialisation` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `specialisation`,
    ADD COLUMN `specialization` VARCHAR(191) NOT NULL DEFAULT 'Лікар-стоматолог';
