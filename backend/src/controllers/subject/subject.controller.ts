import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import zod from "zod";

const prisma = new PrismaClient();

const subjectSchema = zod.object({
  subjectName: zod.string().min(3, "Subject name must be at least 3 characters"),
  subjectCode: zod.string().min(2, "Subject code must be at least 2 characters"),
  semesterId: zod.number().int("Invalid semester ID"),
  facultyId: zod.number().int("Invalid faculty ID").optional(),
});

const updateSubjectSchema = zod.object({
  subjectName: zod.string().min(3, "Subject name must be at least 3 characters").optional(),
  subjectCode: zod.string().min(2, "Subject code must be at least 2 characters").optional(),
  semesterId: zod.number().int("Invalid semester ID").optional(),
  facultyId: zod.number().int("Invalid faculty ID").optional(),
});


const assignFacultySchema = zod.object({
  subjectId: zod.number().int("Invalid subject ID"),
  semesterId: zod.number().int("Invalid semester ID"),
  facultyId: zod.number().int("Invalid faculty ID"),
});

export const createSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = subjectSchema.safeParse(req.body);
    
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
      return;
    }

    const { subjectName, subjectCode, semesterId, facultyId } = result.data;

    // Verify semester exists
    const semesterExists = await prisma.semester.findUnique({
      where: { id: semesterId },
      include: { course: true }
    });

    if (!semesterExists) {
      res.status(404).json({
        success: false,
        message: "Semester not found"
      });
      return;
    }

    const existingSubject = await prisma.subject.findFirst({
      where: {
        subjectCode,
        semester: {
          courseId: semesterExists.courseId
        }
      }
    });

    if (existingSubject) {
      res.status(400).json({
        success: false,
        message: "Subject code already exists in this course"
      });
      return;
    }

    if (facultyId) {
      const faculty = await prisma.user.findFirst({
        where: {
          id: facultyId,
          role: "Faculty"
        }
      });

      if (!faculty) {
        res.status(404).json({
          success: false,
          message: "Faculty not found or user is not a faculty member"
        });
        return;
      }
    }

    const subject = await prisma.subject.create({
      data: {
        subjectName,
        subjectCode,
        semesterId,
        facultyId
      },
      include: {
        semester: true,
        faculty: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject
    });
  } catch (error) {
    console.error("Error in createSubject:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
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
      return res.status(404).json({ success: false, message: "Subject not found" });
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
      include: { semester: {include: { course: true}}, faculty: true, units: true, exams: true },
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
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid subject ID"
      });
      return;
    }

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: { semester: {include: {course: true}}, faculty: {select: {id: true, name: true, email: true }}, units: true, exams: true },
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

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid subject ID"
      });
      return;
    }
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

    const updatedSubject = await prisma.subject.update({
      where: { id: id },
      data: result.data,
      include: {
        semester: true,
        faculty: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: "Subject updated successfully",
      data: updatedSubject
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
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID"
      });
    }

    const subjectExists = await prisma.subject.findUnique({ 
      where: { id },
      include: {
        units: true,
        exams: true,
        coAttainments: true
      }
    });

    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // Delete all related records in a transaction
    await prisma.$transaction(async (prisma) => {
      // Delete CO_Attainments
      await prisma.cO_Attainment.deleteMany({
        where: { subjectId: id }
      });

      // Delete all questions related to the subject's exams
      for (const exam of subjectExists.exams) {
        await prisma.question.deleteMany({
          where: { examId: exam.id }
        });
      }

      // Delete all exams
      await prisma.exam.deleteMany({
        where: { subjectId: id }
      });

      // Delete all CO_PO_Mappings related to the subject's units
      for (const unit of subjectExists.units) {
        await prisma.cO_PO_Mapping.deleteMany({
          where: { coId: unit.id }
        });
      }

      // Delete all units
      await prisma.unit.deleteMany({
        where: { subjectId: id }
      });

      // Finally, delete the subject
      await prisma.subject.delete({
        where: { id }
      });
    });

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteSubject:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return res.status(400).json({
          success: false,
          message: "Cannot delete subject with existing references"
        });
      }
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};