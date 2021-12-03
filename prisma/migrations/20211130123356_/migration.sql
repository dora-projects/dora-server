-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `status` ENUM('enable', 'disable') NOT NULL DEFAULT 'enable',
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `lastLoginAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `deletedAt` DATETIME(6) NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appKey` VARCHAR(255) NOT NULL,
    `type` ENUM('react', 'vue', 'web') NOT NULL DEFAULT 'web',
    `name` VARCHAR(255) NOT NULL,
    `detail` VARCHAR(255) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `deletedAt` DATETIME(6) NULL,

    UNIQUE INDEX `project_appKey_key`(`appKey`),
    UNIQUE INDEX `project_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_projects` (
    `userId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,

    INDEX `user_projects_userId_idx`(`userId`),
    INDEX `user_projects_projectId_idx`(`projectId`),
    PRIMARY KEY (`userId`, `projectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectRole` ENUM('owner', 'developer') NOT NULL DEFAULT 'developer',
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `projectId` INTEGER NULL,
    `userId` INTEGER NULL,

    INDEX `project_roles_userId_idx`(`userId`),
    INDEX `project_roles_projectId_idx`(`projectId`),
    UNIQUE INDEX `project_roles_userId_projectId_key`(`userId`, `projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `issue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fingerprint` VARCHAR(255) NOT NULL,
    `appKey` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NULL,
    `value` VARCHAR(255) NULL,
    `url` VARCHAR(255) NULL,
    `release` VARCHAR(255) NULL,
    `environment` VARCHAR(255) NULL,
    `total` INTEGER NOT NULL,
    `recently` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `issue_fingerprint_appKey_key`(`fingerprint`, `appKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `issue_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alert_contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('user', 'ding') NOT NULL DEFAULT 'user',
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `ruleId` INTEGER NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `alert_contact_userId_key`(`userId`),
    INDEX `alert_contact_ruleId_idx`(`ruleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alert_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `release` VARCHAR(255) NULL,
    `environment` VARCHAR(255) NULL,
    `content` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `ruleId` INTEGER NULL,
    `projectId` INTEGER NULL,

    INDEX `alert_log_ruleId_idx`(`ruleId`),
    INDEX `alert_log_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alert_rule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `filter` JSON NOT NULL,
    `thresholdsTime` INTEGER NOT NULL,
    `thresholdsOperator` VARCHAR(255) NOT NULL DEFAULT '>',
    `thresholdsQuota` INTEGER NOT NULL,
    `silence` INTEGER NOT NULL DEFAULT 10,
    `open` TINYINT NOT NULL DEFAULT 1,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `projectId` INTEGER NULL,

    INDEX `alert_rule_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_projects` ADD CONSTRAINT `user_projects_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_projects` ADD CONSTRAINT `user_projects_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_roles` ADD CONSTRAINT `project_roles_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_roles` ADD CONSTRAINT `project_roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert_contact` ADD CONSTRAINT `alert_contact_ruleId_fkey` FOREIGN KEY (`ruleId`) REFERENCES `alert_rule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert_contact` ADD CONSTRAINT `alert_contact_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert_log` ADD CONSTRAINT `alert_log_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert_log` ADD CONSTRAINT `alert_log_ruleId_fkey` FOREIGN KEY (`ruleId`) REFERENCES `alert_rule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert_rule` ADD CONSTRAINT `alert_rule_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
