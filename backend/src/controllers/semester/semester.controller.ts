import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const semesterSchema = z.object({
  name: z.string().min(3, "Semester name must be at least 3 characters"),
  courseId: z.number().int("Invalid course ID")
});

const updateSemesterSchema = z.object({
  name: z.string().min(3, "Semester name must be at least 3 characters").optional(),
  courseId: z.number().int("Invalid course ID").optional()
});

// Get All Semesters
export const getSemesters = async (req: Request, res: Response) => {
  try {
    const semesters = await prisma.semester.findMany({
      include: {
        course: {
          select: {
            id: true,
            courseName: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },  
        subjects: {
          include: {
            faculty: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },  
      },
    });
    res.json({
      success: true,
      data: semesters
    });
  } catch (error) {
    console.error("Error in getSemesters controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Semester by ID
export const getSemesterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const semesterId = parseInt(id);

    if (isNaN(semesterId)) {
      res.status(400).json({
        success: false,
        message: "Invalid semester ID"
      });
      return;
    }

    const semester = await prisma.semester.findUnique({
      where: { id: semesterId },
      include: {
        course: {
          select: {
            id: true,
            courseName: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        subjects: {
          include: {
            faculty: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            units: true,
            // exams: true
          }
        }
      }
    });

    if (!semester) {
      res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
      return;
    }
    res.json({
      success: true,
      data: semester
    });
  } catch (error) {
    console.error("Error in getSemesterById controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Create Semester
export const createSemester = async (req: Request, res: Response) => {
  try {
    const result = semesterSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format()
      });
      return;
    }
    const { name, courseId } = result.data;

    const courseExists = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!courseExists) {
      res.status(404).json({
        success: false,
        message: "Course not found"
      });
      return;
    }

    const existingSemester = await prisma.semester.findFirst({
      where: {
        name,
        courseId
      }
    });

    if (existingSemester) {
      res.status(400).json({
        success: false,
        message: "Semester with this name already exists in the course"
      });
      return;
    }

    const newSemester = await prisma.semester.create({
      data: {
        name,
        course: { connect: { id: courseId } },  // Connect to the course
      },
      include: {
        course: {
          select: {
            id: true,
            courseName: true
          }
        }
      }
    });
    res.status(201).json({
      success: true,
      message: "Semester created successfully",
      data: newSemester
    });
  } catch (error) {
    console.error("Error in createSemester controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update Semester
export const updateSemester = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const semesterId = parseInt(id);

    if (isNaN(semesterId)) {
      res.status(400).json({
        success: false,
        message: "Invalid semester ID"
      });
      return;
    }
    const result = updateSemesterSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format()
      });
      return;
    }

    const { name, courseId } = result.data;
    const existingSemester = await prisma.semester.findUnique({
      where: { id: semesterId }
    });

    if (!existingSemester) {
      res.status(404).json({
        success: false,
        message: "Semester not found"
      });
      return;
    }

    if (courseId) {
      const courseExists = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!courseExists) {
        res.status(404).json({
          success: false,
          message: "Course not found"
        });
        return;
      }
    }

    const updatedSemester = await prisma.semester.update({
      where: { id: semesterId },
      data: {
        name,
        ...(courseId && { course: { connect: { id: courseId } } })
      },
      include: {
        course: {
          select: {
            id: true,
            courseName: true
          }
        },
        subjects: true
      }
    });
    res.status(201).json({
      success: true,
      message: "Semester updated successfully",
      data: updatedSemester
    });
  } catch (error) {
    console.error("Error in updateSemester controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete Semester
export const deleteSemester = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const semesterId = parseInt(id);

    if (isNaN(semesterId)) {
      res.status(400).json({
        success: false,
        message: "Invalid semester ID"
      });
      return;
    }

    // Check if semester exists
    const semester = await prisma.semester.findUnique({
      where: { id: semesterId },
      include: {
        subjects: true
      }
    });

    if (!semester) {
      res.status(404).json({
        success: false,
        message: "Semester not found"
      });
      return;
    }

    // Check for associated subjects
    if (semester.subjects.length > 0) {
      res.status(400).json({
        success: false,
        message: "Cannot delete semester with associated subjects. Please delete the subjects first."
      });
      return;
    }

    await prisma.semester.delete({
      where: { id: semesterId }
    });
    res.status(204).json({
      success: true,
      message: "Semester deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteSemester controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
