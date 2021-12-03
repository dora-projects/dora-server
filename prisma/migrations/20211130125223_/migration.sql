/*
  Warnings:

  - You are about to drop the `project_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `project_roles` DROP FOREIGN KEY `project_roles_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `project_roles` DROP FOREIGN KEY `project_roles_userId_fkey`;

-- AlterTable
ALTER TABLE `user_projects` ADD COLUMN `prole` ENUM('owner', 'developer') NOT NULL DEFAULT 'developer';

-- DropTable
DROP TABLE `project_roles`;
