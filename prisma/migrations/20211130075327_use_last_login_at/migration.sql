-- AlterTable
ALTER TABLE `user` ADD COLUMN `lastLoginAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);
