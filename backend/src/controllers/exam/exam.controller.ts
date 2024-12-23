import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getExams = async (req: Request, res: Response) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        semester: true,   
        subject: true,   
        questions: true,  
      },
    });
    res.json(exams);
  } catch (error) {
    console.error("Error in getExams controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getExamById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(id) },
      include: {
        semester: true,   
        subject: true,    
        questions: true,  
      },
    });
    if (exam) {
      res.json(exam);
    } else {
      res.status(404).json({ success: false, message: 'Exam not found' });
    }
  } catch (error) {
    console.error("Error in getExamById controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createExam = async (req: Request, res: Response) => {
  const { examType, subjectId, semesterId } = req.body;
  try {
    const newExam = await prisma.exam.create({
      data: {
        examType,
        subject: { connect: { id: subjectId } },  
        semester: { connect: { id: semesterId } }, 
      },
    });
    res.status(201).json(newExam);
  } catch (error) {
    console.error("Error in createExam controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update Exam
export const updateExam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { examType, subjectId, semesterId } = req.body;
  try {
    const updatedExam = await prisma.exam.update({
      where: { id: Number(id) },
      data: {
        examType,
        subject: { connect: { id: subjectId } },  
        semester: { connect: { id: semesterId } }, 
      },
    });
    res.json(updatedExam);
  } catch (error) {
    console.error("Error in updateExam controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete Exam
export const deleteExam = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.exam.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteExam controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
