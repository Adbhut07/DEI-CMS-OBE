-- DropForeignKey
ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `Semester` DROP FOREIGN KEY `Semester_courseId_fkey`;

-- AddForeignKey
ALTER TABLE `Semester` ADD CONSTRAINT `Semester_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
