/*
  Warnings:

  - You are about to drop the column `environment` on the `alert_log` table. All the data in the column will be lost.
  - You are about to drop the column `release` on the `alert_log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `alert_log` DROP COLUMN `environment`,
    DROP COLUMN `release`;
