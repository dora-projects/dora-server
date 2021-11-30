/*
  Warnings:

  - You are about to drop the `setting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_projects_project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `alert_contact` DROP FOREIGN KEY `FK_94e9ccddcb8bb02b9d941665538`;

-- DropForeignKey
ALTER TABLE `alert_contact` DROP FOREIGN KEY `FK_e3d658daf13468ff91a442fe9df`;

-- DropForeignKey
ALTER TABLE `alert_log` DROP FOREIGN KEY `FK_f6e733d4fa007de045c80d96bf1`;

-- DropForeignKey
ALTER TABLE `alert_log` DROP FOREIGN KEY `FK_cf9e827e3ba7f93c4caaeb94578`;

-- DropForeignKey
ALTER TABLE `alert_rule` DROP FOREIGN KEY `FK_2156be16f8c4b9f0d4515415733`;

-- DropForeignKey
ALTER TABLE `project_roles` DROP FOREIGN KEY `FK_c289c4af5520c6aa2a41ddfe2e9`;

-- DropForeignKey
ALTER TABLE `project_roles` DROP FOREIGN KEY `FK_94bb3752bfef052e9fe1b12d82a`;

-- DropForeignKey
ALTER TABLE `setting` DROP FOREIGN KEY `FK_da4c35df28b5b0bd630d216169e`;

-- DropForeignKey
ALTER TABLE `setting` DROP FOREIGN KEY `FK_bbcafb8c4c78d890f75caa632d5`;

-- DropForeignKey
ALTER TABLE `user_projects_project` DROP FOREIGN KEY `FK_936561888bfd63d01c79fe415c3`;

-- DropForeignKey
ALTER TABLE `user_projects_project` DROP FOREIGN KEY `FK_79daf0d2be103f4c30c77ddd6be`;

-- DropTable
DROP TABLE `setting`;

-- DropTable
DROP TABLE `user_projects_project`;

-- CreateTable
CREATE TABLE `user_projects` (
    `userId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,

    INDEX `user_projects_userId_idx`(`userId`),
    INDEX `user_projects_projectId_idx`(`projectId`),
    PRIMARY KEY (`userId`, `projectId`)
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

-- RenameIndex
ALTER TABLE `alert_contact` RENAME INDEX `FK_94e9ccddcb8bb02b9d941665538` TO `alert_contact_ruleId_idx`;

-- RenameIndex
ALTER TABLE `alert_contact` RENAME INDEX `REL_e3d658daf13468ff91a442fe9d` TO `alert_contact_userId_key`;

-- RenameIndex
ALTER TABLE `alert_log` RENAME INDEX `FK_cf9e827e3ba7f93c4caaeb94578` TO `alert_log_ruleId_idx`;

-- RenameIndex
ALTER TABLE `alert_log` RENAME INDEX `FK_f6e733d4fa007de045c80d96bf1` TO `alert_log_projectId_idx`;

-- RenameIndex
ALTER TABLE `alert_rule` RENAME INDEX `FK_2156be16f8c4b9f0d4515415733` TO `alert_rule_projectId_idx`;

-- RenameIndex
ALTER TABLE `issue` RENAME INDEX `IDX_3b2bb04fd84b449feef3e07e7c` TO `issue_fingerprint_appKey_key`;

-- RenameIndex
ALTER TABLE `project` RENAME INDEX `IDX_98fcefc286057ad4ce4f1d6c1b` TO `project_appKey_key`;

-- RenameIndex
ALTER TABLE `project` RENAME INDEX `IDX_dedfea394088ed136ddadeee89` TO `project_name_key`;

-- RenameIndex
ALTER TABLE `project_roles` RENAME INDEX `FK_94bb3752bfef052e9fe1b12d82a` TO `project_roles_userId_idx`;

-- RenameIndex
ALTER TABLE `project_roles` RENAME INDEX `FK_c289c4af5520c6aa2a41ddfe2e9` TO `project_roles_projectId_idx`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `IDX_78a916df40e02a9deb1c4b75ed` TO `user_username_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` TO `user_email_key`;
