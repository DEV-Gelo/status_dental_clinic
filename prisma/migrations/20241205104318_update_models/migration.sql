/*
  Warnings:

  - You are about to drop the column `isBooked` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlots` on the `schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `slotId` INTEGER NULL;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `isBooked`,
    DROP COLUMN `timeSlots`;

-- CreateTable
CREATE TABLE `Slot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `time` VARCHAR(191) NOT NULL,
    `isBooked` BOOLEAN NOT NULL DEFAULT false,
    `date` DATETIME(3) NOT NULL,
    `scheduleId` INTEGER NOT NULL,
    `appointmentId` INTEGER NULL,

    UNIQUE INDEX `Slot_appointmentId_key`(`appointmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Slot` ADD CONSTRAINT `Slot_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Slot` ADD CONSTRAINT `Slot_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
