import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import zod from "zod";

const prisma = new PrismaClient();

const semesterSchema = zod.object({
  name: zod.string().min(3, "Semester name must be at least 3 characters"),
  subjects: zod
    .array(
      zod.object({
        subjectName: zod.string().min(3, "Subject name must be at least 3 characters"),
      })
    )
    .optional(),
});

const courseSchema = zod.object({
  courseName: zod.string().min(3, "Course name must be at least 3 characters"),
  createdById: zod.number().int("Invalid creator ID").positive(),
  semesters: zod.array(semesterSchema).optional(),
});

export const createCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = courseSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { courseName, createdById, semesters } = result.data;

    const course = await prisma.course.create({
      data: {
        courseName,
        createdById,
        semesters: semesters
          ? {
              create: semesters.map((semester) => ({
                name: semester.name,
                subjects: semester.subjects
                  ? { create: semester.subjects }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        semesters: {
          include: {
            subjects: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error in createCourse:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get All Courses with Semesters and Subjects
export const getCourses = async (_req: Request, res: Response): Promise<any> => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        semesters: {
          include: {
            subjects: true,
          },
        },
        createdBy: true,
      },
    });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error in getCourses:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Single Course with Semesters and Subjects
export const getCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        semesters: {
          include: {
            subjects: true,
          },
        },
        createdBy: true,
        Enrollment: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error in getCourse:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update Course with Semesters and Subjects
export const updateCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    const result = courseSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { courseName, semesters } = result.data;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        courseName,
        semesters: semesters
          ? {
              create: semesters.map((semester) => ({
                name: semester.name,
                subjects: semester.subjects
                  ? { create: semester.subjects }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        semesters: {
          include: {
            subjects: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error in updateCourse:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Course
export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);

    await prisma.course.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteCourse:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
