/*
  Warnings:

  - A unique constraint covering the columns `[studentId,examId,isTotal]` on the table `Marks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Marks_studentId_examId_subjectId_key` ON `Marks`;

-- AlterTable
ALTER TABLE `Marks` ADD COLUMN `isTotal` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Marks_studentId_examId_isTotal_key` ON `Marks`(`studentId`, `examId`, `isTotal`);
