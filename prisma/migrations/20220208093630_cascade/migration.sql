-- DropForeignKey
ALTER TABLE `alert_contact` DROP FOREIGN KEY `alert_contact_ruleId_fkey`;

-- DropForeignKey
ALTER TABLE `alert_contact` DROP FOREIGN KEY `alert_contact_userId_fkey`;

-- DropForeignKey
ALTER TABLE `alert_log` DROP FOREIGN KEY `alert_log_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `alert_log` DROP FOREIGN KEY `alert_log_ruleId_fkey`;

-- DropForeignKey
ALTER TABLE `alert_rule` DROP FOREIGN KEY `alert_rule_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `artifact` DROP FOREIGN KEY `artifact_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `sourcemap` DROP FOREIGN KEY `sourcemap_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `user_config` DROP FOREIGN KEY `user_config_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `user_config` DROP FOREIGN KEY `user_config_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user_projects` DROP FOREIGN KEY `user_projects_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `user_projects` DROP FOREIGN KEY `user_projects_userId_fkey`;

-- AddForeignKey
ALTER TABLE `user_projects` ADD CONSTRAINT `user_projects_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_projects` ADD CONSTRAINT `user_projects_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_config` ADD CONSTRAINT `user_config_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_config` ADD CONSTRAINT `user_config_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sourcemap` ADD CONSTRAINT `sourcemap_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artifact` ADD CONSTRAINT `artifact_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert_contact` ADD CONSTRAINT `alert_contact_ruleId_fkey` FOREIGN KEY (`ruleId`) REFERENCES `alert_rule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert_contact` ADD CONSTRAINT `alert_contact_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert_log` ADD CONSTRAINT `alert_log_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert_log` ADD CONSTRAINT `alert_log_ruleId_fkey` FOREIGN KEY (`ruleId`) REFERENCES `alert_rule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert_rule` ADD CONSTRAINT `alert_rule_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
