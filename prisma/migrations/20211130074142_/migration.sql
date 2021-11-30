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
    `deletedAt` DATETIME(6) NULL,

    UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed`(`username`),
    UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2`(`email`),
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

    UNIQUE INDEX `IDX_98fcefc286057ad4ce4f1d6c1b`(`appKey`),
    UNIQUE INDEX `IDX_dedfea394088ed136ddadeee89`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_projects_project` (
    `userId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,

    INDEX `IDX_79daf0d2be103f4c30c77ddd6b`(`userId`),
    INDEX `IDX_936561888bfd63d01c79fe415c`(`projectId`),
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

    INDEX `FK_94bb3752bfef052e9fe1b12d82a`(`userId`),
    INDEX `FK_c289c4af5520c6aa2a41ddfe2e9`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `projectId` INTEGER NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `REL_da4c35df28b5b0bd630d216169`(`projectId`),
    UNIQUE INDEX `REL_bbcafb8c4c78d890f75caa632d`(`userId`),
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

    UNIQUE INDEX `IDX_3b2bb04fd84b449feef3e07e7c`(`fingerprint`, `appKey`),
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

    UNIQUE INDEX `REL_e3d658daf13468ff91a442fe9d`(`userId`),
    INDEX `FK_94e9ccddcb8bb02b9d941665538`(`ruleId`),
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

    INDEX `FK_cf9e827e3ba7f93c4caaeb94578`(`ruleId`),
    INDEX `FK_f6e733d4fa007de045c80d96bf1`(`projectId`),
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

    INDEX `FK_2156be16f8c4b9f0d4515415733`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_projects_project` ADD CONSTRAINT `FK_936561888bfd63d01c79fe415c3` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_projects_project` ADD CONSTRAINT `FK_79daf0d2be103f4c30c77ddd6be` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_roles` ADD CONSTRAINT `FK_c289c4af5520c6aa2a41ddfe2e9` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `project_roles` ADD CONSTRAINT `FK_94bb3752bfef052e9fe1b12d82a` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `setting` ADD CONSTRAINT `FK_da4c35df28b5b0bd630d216169e` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `setting` ADD CONSTRAINT `FK_bbcafb8c4c78d890f75caa632d5` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alert_contact` ADD CONSTRAINT `FK_94e9ccddcb8bb02b9d941665538` FOREIGN KEY (`ruleId`) REFERENCES `alert_rule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alert_contact` ADD CONSTRAINT `FK_e3d658daf13468ff91a442fe9df` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alert_log` ADD CONSTRAINT `FK_f6e733d4fa007de045c80d96bf1` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alert_log` ADD CONSTRAINT `FK_cf9e827e3ba7f93c4caaeb94578` FOREIGN KEY (`ruleId`) REFERENCES `alert_rule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alert_rule` ADD CONSTRAINT `FK_2156be16f8c4b9f0d4515415733` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
