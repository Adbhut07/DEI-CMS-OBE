/*
  Warnings:

  - A unique constraint covering the columns `[studentId,examId,subjectId,questionId]` on the table `Marks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Marks_studentId_examId_subjectId_key` ON `Marks`;

-- CreateIndex
CREATE UNIQUE INDEX `Marks_studentId_examId_subjectId_questionId_key` ON `Marks`(`studentId`, `examId`, `subjectId`, `questionId`);
