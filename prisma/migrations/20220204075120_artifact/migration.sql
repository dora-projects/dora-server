-- CreateTable
CREATE TABLE `artifact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(255) NULL,
    `release` VARCHAR(255) NULL,
    `projectId` INTEGER NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `artifact` ADD CONSTRAINT `artifact_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
