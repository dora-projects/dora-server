-- AlterTable
ALTER TABLE `artifact` ADD COLUMN `compressedPath` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `sourcemap` ADD COLUMN `compressedPath` VARCHAR(255) NULL;
