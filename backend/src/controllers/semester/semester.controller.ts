// controllers/semesterController.ts

import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema for validating the request body
const getActiveSemestersSchema = z.object({
  batchId: z.number().positive("Batch ID must be a positive number"),
});

/**
 * Fetches the list of active semesters for a specific batch
 * This can be used to populate dropdown menus for semester selection
 */
export const getActiveSemesters = async (req: any, res: any) => {
  try {
    // Validate request body
    const parseResult = getActiveSemestersSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.flatten() });
    }

    const { batchId } = parseResult.data;

    // Check if the batch exists
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        course: true,
      },
    });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // For student users, check if they're enrolled in this batch
    if (req.user.role === "Student") {
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          studentId: req.user.id,
          batchId: batchId,
          isActive: true,
        },
      });

      if (!enrollment) {
        return res.status(403).json({ message: "You are not enrolled in this batch" });
      }
    }

    // Get distinct semesters from CourseSubject for this batch
    const courseSubjects = await prisma.courseSubject.findMany({
      where: {
        batchId: batchId,
      },
      select: {
        semester: true,
      },
      distinct: ['semester'],
      orderBy: {
        semester: 'asc',
      },
    });

    // Extract and format the semester information
    const activeSemesters = courseSubjects.map(cs => ({
      semester: cs.semester,
    }));

    // Return the list of active semesters along with batch and course information
    return res.status(200).json({
      batchYear: batch.batchYear,
      courseName: batch.course.courseName,
      activeSemesters: activeSemesters,
    });
  } catch (error) {
    console.error("Error fetching active semesters:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Fetches the list of active semesters for the current student's batch
 * This is a convenience endpoint for students to easily get their semesters
 */
export const getCurrentStudentSemesters = async (req: any, res: any) => {
  try {
    // Only allow students to access this endpoint
    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "This endpoint is only for students" });
    }

    const userId = req.user.id;
    
    // Find the student's active enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: userId,
        isActive: true,
      },
      include: {
        batch: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({ message: "No active enrollment found" });
    }

    // Get distinct semesters from CourseSubject for this batch
    const courseSubjects = await prisma.courseSubject.findMany({
      where: {
        batchId: enrollment.batchId,
      },
      select: {
        semester: true,
      },
      distinct: ['semester'],
      orderBy: {
        semester: 'asc',
      },
    });

    // Extract and format the semester information
    const activeSemesters = courseSubjects.map(cs => ({
      semester: cs.semester,
    }));

    // Return the list of active semesters along with batch and course information
    return res.status(200).json({
      batchId: enrollment.batchId,
      batchYear: enrollment.batch.batchYear,
      courseName: enrollment.batch.course.courseName,
      activeSemesters: activeSemesters,
    });
  } catch (error) {
    console.error("Error fetching student semesters:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};