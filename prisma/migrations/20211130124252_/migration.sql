/*
  Warnings:

  - You are about to drop the column `projectRole` on the `project_roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `project_roles` DROP COLUMN `projectRole`,
    ADD COLUMN `prole` ENUM('owner', 'developer') NOT NULL DEFAULT 'developer';
