-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `house` VARCHAR(191) NULL,
    `office` VARCHAR(191) NULL,
    `zipcode` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phoneNumbers` JSON NULL,
    `x` DOUBLE NULL,
    `y` DOUBLE NULL,
    `z` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
