/*
  Warnings:

  - A unique constraint covering the columns `[examType,subjectId,semesterId]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Exam_examType_subjectId_semesterId_key` ON `Exam`(`examType`, `subjectId`, `semesterId`);
