/*
  Warnings:

  - A unique constraint covering the columns `[batchId,rollNo]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Enrollment` ADD COLUMN `rollNo` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Enrollment_batchId_rollNo_key` ON `Enrollment`(`batchId`, `rollNo`);
