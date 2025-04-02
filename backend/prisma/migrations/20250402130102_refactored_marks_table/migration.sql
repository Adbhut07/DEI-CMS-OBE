/*
  Warnings:

  - You are about to drop the `Marks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Marks` DROP FOREIGN KEY `Marks_examId_fkey`;

-- DropForeignKey
ALTER TABLE `Marks` DROP FOREIGN KEY `Marks_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `Marks` DROP FOREIGN KEY `Marks_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `Marks` DROP FOREIGN KEY `Marks_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `Marks` DROP FOREIGN KEY `Marks_uploadedById_fkey`;

-- DropTable
DROP TABLE `Marks`;

-- CreateTable
CREATE TABLE `QuestionMark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marksObtained` INTEGER NOT NULL,
    `standardExamMarkId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `QuestionMark_standardExamMarkId_questionId_key`(`standardExamMarkId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StandardExamMarks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `examId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `totalMarks` INTEGER NOT NULL,
    `uploadedById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StandardExamMarks_studentId_examId_key`(`studentId`, `examId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InternalAssessmentMarks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `examId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `marksObtained` INTEGER NOT NULL,
    `uploadedById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InternalAssessmentMarks_studentId_examId_key`(`studentId`, `examId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuestionMark` ADD CONSTRAINT `QuestionMark_standardExamMarkId_fkey` FOREIGN KEY (`standardExamMarkId`) REFERENCES `StandardExamMarks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionMark` ADD CONSTRAINT `QuestionMark_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StandardExamMarks` ADD CONSTRAINT `StandardExamMarks_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StandardExamMarks` ADD CONSTRAINT `StandardExamMarks_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StandardExamMarks` ADD CONSTRAINT `StandardExamMarks_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StandardExamMarks` ADD CONSTRAINT `StandardExamMarks_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalAssessmentMarks` ADD CONSTRAINT `InternalAssessmentMarks_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalAssessmentMarks` ADD CONSTRAINT `InternalAssessmentMarks_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalAssessmentMarks` ADD CONSTRAINT `InternalAssessmentMarks_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalAssessmentMarks` ADD CONSTRAINT `InternalAssessmentMarks_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
