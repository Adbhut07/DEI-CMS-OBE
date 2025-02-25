import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import zod from 'zod';

const prisma = new PrismaClient();

const courseSchema = zod.object({
  courseName: zod.string().min(3, "Course name must be at least 3 characters long"),
});

export const createCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = courseSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: result.error.format(),
      });
    }

    const { courseName } = req.body;

    const createdById = req.user?.id;
    if (!createdById) {
      return res.status(400).json({ success: false, message: "Invalid req.user ID" });
    }
    
    const course = await prisma.course.create({
      data: { courseName, createdById },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error creating course:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllCourses = async (_req: Request, res: Response): Promise<any> => {
  try {
    const courses = await prisma.course.findMany({ include: { createdBy: true } });
    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching courses:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    console.log(courseId);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID" });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { createdBy: true, subjects: true, batches: true },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("Error fetching course by ID:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID" });
    }

    const { courseName } = req.body;
    if (!courseName || courseName.length < 3) {
      return res.status(400).json({ success: false, message: "Invalid Course Name" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { courseName },
    });

    return res.status(200).json({ success: true, message: "Course updated successfully", data: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID" });
    }

    await prisma.course.delete({ where: { id: courseId } });
    return res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
