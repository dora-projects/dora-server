/*
  Warnings:

  - The primary key for the `project_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `project_roles` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `project_roles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `project_roles` table. All the data in the column will be lost.
  - Made the column `projectId` on table `project_roles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `project_roles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `project_roles` DROP FOREIGN KEY `project_roles_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `project_roles` DROP FOREIGN KEY `project_roles_userId_fkey`;

-- DropIndex
DROP INDEX `project_roles_userId_projectId_key` ON `project_roles`;

-- AlterTable
ALTER TABLE `project_roles` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `id`,
    DROP COLUMN `updatedAt`,
    MODIFY `projectId` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`, `projectId`);

-- AddForeignKey
ALTER TABLE `project_roles` ADD CONSTRAINT `project_roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_roles` ADD CONSTRAINT `project_roles_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
