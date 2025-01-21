import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import zod from "zod";

const prisma = new PrismaClient();

const subjectSchema = zod.object({
  subjectName: zod.string().min(3, "Subject name must be at least 3 characters"),
  semesterId: zod.number().int("Invalid semester ID"),
});

const updateSubjectSchema = zod.object({
  subjectName: zod.string().min(3, "Subject name must be at least 3 characters").optional(),
  semesterId: zod.number().int("Invalid semester ID").optional(),
  facultyId: zod.number().int("Invalid faculty ID").optional(),
});


const assignFacultySchema = zod.object({
  subjectId: zod.number().int("Invalid subject ID"),
  semesterId: zod.number().int("Invalid semester ID"),
  facultyId: zod.number().int("Invalid faculty ID"),
});

export const createSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = subjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { subjectName, semesterId } = result.data;

    const semesterExists = await prisma.semester.findUnique({
      where: { id: semesterId },
    });

    if (!semesterExists) {
      return res.status(404).json({
        success: false,
        message: "Semester not found",
      });
    }

    const subject = await prisma.subject.create({
      data: {
        subjectName,
        semesterId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Error in createSubject:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const assignFacultyToSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params; 

    const result = assignFacultySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { subjectId, semesterId, facultyId } = result.data;

    const courseExists = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const subject = await prisma.subject.findFirst({
      where: {
        id: subjectId,
        semesterId: semesterId, // Ensure semesterId matches
        semester: {
          courseId: parseInt(courseId), // Ensure courseId matches
        },
      },
    });
    
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found 123" });
    }
    

    const faculty = await prisma.user.findUnique({
      where: { id: facultyId },
    });

    if (!faculty || faculty.role !== "Faculty") {
      return res.status(403).json({
        success: false,
        message: "Invalid or unauthorized faculty ID",
      });
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: { facultyId },
    });

    res.status(200).json({
      success: true,
      message: "Faculty assigned to subject successfully",
      data: updatedSubject,
    });
  } catch (error) {
    console.error("Error in assignFacultyToSubject:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSubjects = async (req: Request, res: Response): Promise<any> => {
  try {
    const { semesterId } = req.query;

    const whereClause = semesterId
      ? { semesterId: Number(semesterId) }
      : {};

    const subjects = await prisma.subject.findMany({
      where: whereClause,
      include: { semester: true, faculty: true, units: true },
    });

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error("Error in getSubjects:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: { semester: true, faculty: true, units: true },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error("Error in getSubject:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    const result = updateSubjectSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { facultyId } = result.data;

    const subjectExists = await prisma.subject.findUnique({ where: { id } });
    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    if (facultyId !== undefined) {
      const faculty = await prisma.user.findUnique({
        where: { id: facultyId },
      });

      if (!faculty || faculty.role !== "Faculty") {
        return res.status(403).json({
          success: false,
          message: "Invalid or unauthorized faculty ID",
        });
      }
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: result.data,
    });

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Error in updateSubject:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);

    const subjectExists = await prisma.subject.findUnique({ where: { id } });
    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    await prisma.subject.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteSubject:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
