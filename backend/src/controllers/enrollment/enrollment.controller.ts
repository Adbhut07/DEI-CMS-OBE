import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import zod from 'zod';

const prisma = new PrismaClient();

const enrollmentSchema = zod.object({
  studentId: zod.number().int().positive("Student ID must be a positive integer"),
  batchId: zod.number().int().positive("Batch ID must be a positive integer"),
  rollNo: zod.string().min(1, "Roll number is required")
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

    const { studentId, batchId, rollNo } = req.body;

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { studentId, batchId },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this batch",
      });
    }

    const rollNoExists = await prisma.enrollment.findFirst({
      where: { batchId, rollNo },
    });

    if (rollNoExists) {
      return res.status(400).json({
        success: false,
        message: "This roll number is already assigned in this batch",
      });
    }

    // Create Enrollment
    const enrollment = await prisma.enrollment.create({
      data: { studentId, batchId, rollNo },
    });

    return res.status(201).json({
      success: true,
      message: "Student enrolled successfully",
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

// ✅ Get All Enrolled Students in a Course by Batch
export const getEnrollmentsByCourseAndBatch = async (req: Request, res: Response): Promise<any> => {
    try {
      const batchId = parseInt(req.params.batchId);
  
      if (isNaN(batchId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Batch ID",
        });
      }
  
      // Find batch and get courseId
      const batch = await prisma.batch.findUnique({
        where: { id: batchId },
        include: { course: true },
      });
  
      if (!batch) {
        return res.status(404).json({
          success: false,
          message: "Batch not found",
        });
      }
  
      // Fetch enrolled students in the batch
      const enrollments = await prisma.enrollment.findMany({
        where: { batchId },
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
        },
      });
  
      return res.status(200).json({
        success: true,
        message: `Students enrolled in course ${batch.course.courseName}, Batch ${batch.batchYear}`,
        courseId: batch.course.id,
        courseName: batch.course.courseName,
        batchYear: batch.batchYear,
        students: enrollments.map((enrollment) => ({
          ...enrollment.student,
          rollNo: enrollment.rollNo,
        })),
      });
    } catch (error) {
      console.error("Error fetching enrollments by course and batch:", (error as Error).message);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
};
  

// ✅ Get All Enrolled Students in a Batch
export const getEnrollmentsByBatch = async (req: Request, res: Response): Promise<any> => {
  try {
    const batchId = parseInt(req.params.batchId);

    if (isNaN(batchId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Batch ID",
      });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { batchId },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: enrollments.map((enrollment) => ({
        ...enrollment,
        student: { ...enrollment.student, rollNo: enrollment.rollNo },
      })),
    });
  } catch (error) {
    console.error("Error fetching enrollments:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ✅ Get Student's Enrollment Details
export const getStudentEnrollment = async (req: Request, res: Response): Promise<any> => {
  try {
    const studentId = parseInt(req.params.studentId);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID",
      });
    }

    const enrollment = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        batch: {
          select: { id: true, batchYear: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: enrollment.map((e) => ({
        ...e,
        rollNo: e.rollNo,
      })),
    });
  } catch (error) {
    console.error("Error fetching student's enrollment:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ✅ Remove Student from Batch (Dropout)
export const removeEnrollment = async (req: Request, res: Response): Promise<any> => {
  try {
    const enrollmentId = parseInt(req.params.enrollmentId);

    if (isNaN(enrollmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Enrollment ID",
      });
    }

    // Soft Delete: Set isActive to false
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { isActive: false },
    });

    return res.status(200).json({
      success: true,
      message: "Enrollment removed successfully",
    });
  } catch (error) {
    console.error("Error removing enrollment:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const updateEnrollmentStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const enrollmentId = parseInt(req.params.enrollmentId);
    const isActive = req.body.isActive;

    if (isNaN(enrollmentId) || typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
      });
    }

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { isActive },
    });

    return res.status(200).json({
      success: true,
      message: "Enrollment status updated successfully",
    });
  } catch (error) {
    console.error("Error updating enrollment status:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};