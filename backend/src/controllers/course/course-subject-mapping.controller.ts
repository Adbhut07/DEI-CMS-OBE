import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import zod from 'zod';

const prisma = new PrismaClient();

const courseSubjectSchema = zod.object({
  courseId: zod.number().int().positive("Course ID must be a positive integer"),
  subjectId: zod.number().int().positive("Subject ID must be a positive integer"),
  semester: zod.number().int().min(1).max(8, "Semester must be between 1 and 8"),
  batchId: zod.number().int().positive("Batch ID must be a positive integer"),
});

export const mapCourseToSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = courseSubjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: result.error.format(),
      });
    }

    const { courseId, subjectId, semester, batchId } = req.body;

    const mapping = await prisma.courseSubject.create({
      data: { courseId, subjectId, semester, batchId },
    });

    return res.status(201).json({
      success: true,
      message: "Subject mapped to course successfully",
      data: mapping,
    });
  } catch (error) {
    console.error("Error mapping subject to course:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const assignFacultyToSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseSubjectId, facultyId } = req.body;
    if (!courseSubjectId || !facultyId) {
      return res.status(400).json({ success: false, message: "CourseSubject ID and Faculty ID are required" });
    }

    const updatedMapping = await prisma.courseSubject.update({
      where: { id: courseSubjectId },
      data: { facultyId },
    });

    return res.status(200).json({
      success: true,
      message: "Faculty assigned to subject successfully",
      data: updatedMapping,
    });
  } catch (error) {
    console.error("Error assigning faculty to subject:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSubjectsByCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const courseId = parseInt(req.params.courseId);
        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid Course ID" });
        }

        const subjects = await prisma.courseSubject.findMany({
            where: { courseId },
            include: {
                subject: true, 
                faculty: {      
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true, 
                    }
                },
                batch: {
                  select: {
                      id: true,
                      batchYear: true,
                      courseId: true
                  }
              }
            },
        });

        return res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        console.error("Error fetching subjects by course ID:", (error as Error).message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getSubjectsWithUnitsByCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const courseId = parseInt(req.params.courseId);
        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid Course ID" });
        }

        const subjects = await prisma.courseSubject.findMany({
            where: { courseId },
            include: {
                subject: {
                    include: {
                        units: true, // Includes all units of the subject
                    }
                },
                faculty: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    }
                }
            },
        });

        return res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        console.error("Error fetching subjects with units by course ID:", (error as Error).message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const unmapCourseFromSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const mappingId = parseInt(req.params.id);
    
    if (isNaN(mappingId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid mapping ID. Please provide a valid number." 
      });
    }

    // Check if the mapping exists
    const existingMapping = await prisma.courseSubject.findUnique({
      where: { id: mappingId }
    });

    if (!existingMapping) {
      return res.status(404).json({
        success: false,
        message: "Course-Subject mapping not found"
      });
    }

    // Delete the mapping
    await prisma.courseSubject.delete({
      where: { id: mappingId }
    });

    return res.status(200).json({
      success: true,
      message: "Subject unmapped from course successfully"
    });
  } catch (error) {
    console.error("Error unmapping subject from course:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};