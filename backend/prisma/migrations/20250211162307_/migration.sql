/*
  Warnings:

  - You are about to drop the column `courseId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `semesterId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `semesterId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the `CourseOutcome` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[examType,subjectId]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `batchId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectCode` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CourseOutcome` DROP FOREIGN KEY `CourseOutcome_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseOutcome` DROP FOREIGN KEY `CourseOutcome_unitId_fkey`;

-- DropForeignKey
ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_semesterId_fkey`;

-- DropForeignKey
ALTER TABLE `Exam` DROP FOREIGN KEY `Exam_semesterId_fkey`;

-- DropIndex
DROP INDEX `Exam_examType_subjectId_semesterId_key` ON `Exam`;

-- AlterTable
ALTER TABLE `Enrollment` DROP COLUMN `courseId`,
    DROP COLUMN `semesterId`,
    ADD COLUMN `batchId` INTEGER NOT NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Exam` DROP COLUMN `semesterId`,
    MODIFY `examType` ENUM('CT1', 'CT2', 'DHA', 'CA', 'AA', 'ATT', 'ESE') NOT NULL;

-- AlterTable
ALTER TABLE `Subject` ADD COLUMN `subjectCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Unit` ADD COLUMN `attainment` DOUBLE NOT NULL DEFAULT 0.0;

-- DropTable
DROP TABLE `CourseOutcome`;

-- CreateTable
CREATE TABLE `Batch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `batchYear` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgramOutcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `batchId` INTEGER NULL,
    `description` VARCHAR(191) NOT NULL,
    `attainment` DOUBLE NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CO_PO_Mapping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coId` INTEGER NOT NULL,
    `poId` INTEGER NOT NULL,
    `weightage` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CO_Attainment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coId` INTEGER NOT NULL,
    `batchId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `attainment` DOUBLE NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CO_Attainment_coId_batchId_subjectId_key`(`coId`, `batchId`, `subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PO_Attainment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poId` INTEGER NOT NULL,
    `batchId` INTEGER NOT NULL,
    `attainment` DOUBLE NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PO_Attainment_poId_batchId_key`(`poId`, `batchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Exam_examType_subjectId_key` ON `Exam`(`examType`, `subjectId`);

-- AddForeignKey
ALTER TABLE `Batch` ADD CONSTRAINT `Batch_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramOutcome` ADD CONSTRAINT `ProgramOutcome_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgramOutcome` ADD CONSTRAINT `ProgramOutcome_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CO_PO_Mapping` ADD CONSTRAINT `CO_PO_Mapping_coId_fkey` FOREIGN KEY (`coId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CO_PO_Mapping` ADD CONSTRAINT `CO_PO_Mapping_poId_fkey` FOREIGN KEY (`poId`) REFERENCES `ProgramOutcome`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CO_Attainment` ADD CONSTRAINT `CO_Attainment_coId_fkey` FOREIGN KEY (`coId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CO_Attainment` ADD CONSTRAINT `CO_Attainment_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CO_Attainment` ADD CONSTRAINT `CO_Attainment_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PO_Attainment` ADD CONSTRAINT `PO_Attainment_poId_fkey` FOREIGN KEY (`poId`) REFERENCES `ProgramOutcome`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PO_Attainment` ADD CONSTRAINT `PO_Attainment_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
