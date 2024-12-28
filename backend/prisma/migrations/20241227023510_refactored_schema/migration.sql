/*
  Warnings:

  - You are about to drop the column `enrollmentDate` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `questionNumber` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `semesterName` on the `Semester` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,questionId,examId]` on the table `Marks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examId` to the `Marks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marksAllocated` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionText` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_subjectId_fkey`;

-- AlterTable
ALTER TABLE `Course` ADD COLUMN `createdById` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Enrollment` DROP COLUMN `enrollmentDate`,
    DROP COLUMN `subjectId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Exam` MODIFY `examType` ENUM('CT1', 'CT2', 'DHA', 'CA') NOT NULL;

-- AlterTable
ALTER TABLE `Marks` ADD COLUMN `examId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `questionNumber`,
    ADD COLUMN `marksAllocated` INTEGER NOT NULL,
    ADD COLUMN `questionText` VARCHAR(191) NOT NULL,
    ADD COLUMN `unitId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Semester` DROP COLUMN `semesterName`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Subject` ADD COLUMN `facultyId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Unit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitNumber` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `subjectId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseOutcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `unitId` INTEGER NOT NULL,
    `attainment` DOUBLE NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `subjectId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Marks_studentId_questionId_examId_key` ON `Marks`(`studentId`, `questionId`, `examId`);

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Unit` ADD CONSTRAINT `Unit_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseOutcome` ADD CONSTRAINT `CourseOutcome_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseOutcome` ADD CONSTRAINT `CourseOutcome_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Marks` ADD CONSTRAINT `Marks_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
