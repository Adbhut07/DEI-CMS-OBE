/*
  Warnings:

  - You are about to drop the column `facultyId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `semesterId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the `Semester` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[subjectCode]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Made the column `batchId` on table `ProgramOutcome` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ProgramOutcome` DROP FOREIGN KEY `ProgramOutcome_batchId_fkey`;

-- DropForeignKey
ALTER TABLE `Semester` DROP FOREIGN KEY `Semester_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `Subject` DROP FOREIGN KEY `Subject_facultyId_fkey`;

-- DropForeignKey
ALTER TABLE `Subject` DROP FOREIGN KEY `Subject_semesterId_fkey`;

-- AlterTable
ALTER TABLE `ProgramOutcome` MODIFY `batchId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Subject` DROP COLUMN `facultyId`,
    DROP COLUMN `semesterId`;

-- DropTable
DROP TABLE `Semester`;

-- CreateTable
CREATE TABLE `CourseSubject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `semester` INTEGER NOT NULL,
    `facultyId` INTEGER NULL,
    `batchId` INTEGER NOT NULL,

    UNIQUE INDEX `CourseSubject_courseId_subjectId_semester_batchId_key`(`courseId`, `subjectId`, `semester`, `batchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Subject_subjectCode_key` ON `Subject`(`subjectCode`);

-- AddForeignKey
ALTER TABLE `CourseSubject` ADD CONSTRAINT `CourseSubject_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSubject` ADD CONSTRAINT `CourseSubject_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSubject` ADD CONSTRAINT `CourseSubject_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSubject` ADD CONSTRAINT `CourseSubject_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramOutcome` ADD CONSTRAINT `ProgramOutcome_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
