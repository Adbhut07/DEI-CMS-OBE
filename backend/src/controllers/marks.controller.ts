// marksController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all marks
export const getMarks = async (req: Request, res: Response) => {
  try {
    const marks = await prisma.marks.findMany({
      include: {
        student: true,
        question: {
          include: {
            exam: true
          }
        },
        uploadedBy: true
      }
    });
    res.json(marks);
  } catch (error) {
    console.error("Error in getMarks controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get marks by student ID
export const getMarksByStudentId = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  try {
    const marks = await prisma.marks.findMany({
      where: { studentId: Number(studentId) },
      include: {
        question: {
          include: {
            exam: true
          }
        },
        uploadedBy: true
      }
    });
    if (marks.length > 0) {
      res.json(marks);
    } else {
      res.status(404).json({ error: 'No marks found for the student' });
    }
  } catch (error) {
    console.error("Error in getMarksByStudentId controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Create marks for a student
export const createMarks = async (req: Request, res: Response) => {
  const { studentId, questionId, marksObtained, uploadedById } = req.body;
  try {
    const newMarks = await prisma.marks.create({
      data: {
        studentId,
        questionId,
        marksObtained,
        uploadedById
      }
    });
    res.status(201).json(newMarks);
  } catch (error) {
    console.error("Error in createMarks controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update marks for a student
export const updateMarks = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { marksObtained } = req.body;
  try {
    const updatedMarks = await prisma.marks.update({
      where: { id: Number(id) },
      data: { marksObtained }
    });
    res.json(updatedMarks);
  } catch (error) {
    console.error("Error in updateMarks controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete marks
export const deleteMarks = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.marks.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteMarks controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
