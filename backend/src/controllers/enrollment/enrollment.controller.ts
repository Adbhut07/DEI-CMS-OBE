import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import zod from 'zod';

const prisma = new PrismaClient();

const enrollmentSchema = zod.object({
  studentId: zod.number().int().positive("Student ID must be a positive integer"),
  courseId: zod.number().int().positive("Course ID must be a positive integer"),
  semesterId: zod.number().int().positive("Semester ID must be a positive integer"),
});

export const createEnrollment = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = enrollmentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: result.error.format(),
      });
    }

    const { studentId, courseId, semesterId } = req.body;

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        semesterId,
      },
    });

    return res.status(201).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    console.error("Error creating enrollment:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllEnrollments = async (req: Request, res: Response): Promise<any> => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: true,
        course: true,
        semester: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error("Error fetching enrollments:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Enrollment by ID
export const getEnrollmentById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: true,
        course: true,
        semester: true,
      },
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    console.error("Error fetching enrollment by ID:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update Enrollment
export const updateEnrollment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const result = enrollmentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: result.error.format(),
      });
    }

    const { studentId, courseId, semesterId } = req.body;

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: parseInt(id) },
      data: {
        studentId,
        courseId,
        semesterId,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedEnrollment,
    });
  } catch (error) {
    console.error("Error updating enrollment:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Enrollment
export const deleteEnrollment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    await prisma.enrollment.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting enrollment:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getEnrollmentsByCourseId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params;
    const { semesterId } = req.query; 

    const filter: any = { courseId: parseInt(courseId) };

    if (semesterId) {
      filter.semesterId = parseInt(semesterId as string); 
    }

    const enrollments = await prisma.enrollment.findMany({
      where: filter,
      include: {
        student: true,
        course: true,
        semester: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error("Error fetching enrollments by course ID:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
