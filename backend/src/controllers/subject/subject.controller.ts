// **************** New Approach ****************


import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import zod from 'zod';

const prisma = new PrismaClient();

const subjectSchema = zod.object({
  subjectName: zod.string().min(1, "Subject name is required"),
  subjectCode: zod.string().min(1, "Subject code is required"),
});

export const createSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = subjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: result.error.format(),
      });
    }

    const { subjectName, subjectCode } = req.body;
    const subject = await prisma.subject.create({
      data: { subjectName, subjectCode },
    });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Error creating subject:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllSubjects = async (req: Request, res: Response): Promise<any> => {
  try {
    const subjects = await prisma.subject.findMany();
    return res.status(200).json({ success: true, data: subjects });
  }
  catch (error) {
    console.error("Error fetching subjects:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const getAllSubjectsDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        units: true,  
        courseMappings: {
          include: {
            course: true,  
            faculty: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    console.error("Error fetching subjects:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSubjectById = async (req: Request, res: Response): Promise<any> => {
  try {
    const subjectId = parseInt(req.params.subjectId);
    if (isNaN(subjectId)) {
      return res.status(400).json({ success: false, message: "Invalid Subject ID" });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        units: true,  // Fetch all units related to the subject
        courseMappings: {
          include: {
            course: true,  // Fetch the course details linked to this subject
            faculty: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    return res.status(200).json({ success: true, data: subject });
  } catch (error) {
    console.error("Error fetching subject by ID:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const subjectId = parseInt(req.params.subjectId);
    if (isNaN(subjectId)) {
      return res.status(400).json({ success: false, message: "Invalid Subject ID" });
    }

    const { subjectName, subjectCode } = req.body;
    if (!subjectName || !subjectCode) {
      return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: { subjectName, subjectCode },
    });

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: updatedSubject,
    });
  } catch (error) {
    console.error("Error updating subject:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const subjectId = parseInt(req.params.subjectId);
    if (isNaN(subjectId)) {
      return res.status(400).json({ success: false, message: "Invalid Subject ID" });
    }

    await prisma.subject.delete({ where: { id: subjectId } });

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subject:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
