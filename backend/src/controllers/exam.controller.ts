// examController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getExams = async (req: Request, res: Response) => {
  try {
    const exams = await prisma.exam.findMany();
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
      where: { id: Number(id) }
    });
    res.json(exam);
  } catch (error) {
    console.error("Error in getExamById controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createExam = async (req: Request, res: Response) => {
  const { examType, semesterId, subjectId } = req.body;
  try {
    const newExam = await prisma.exam.create({
      data: { examType, semesterId, subjectId }
    });
    res.status(201).json(newExam);
  } catch (error) {
    console.error("Error in createExam controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateExam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { examType, semesterId, subjectId } = req.body;
  try {
    const updatedExam = await prisma.exam.update({
      where: { id: Number(id) },
      data: { examType, semesterId, subjectId }
    });
    res.json(updatedExam);
  } catch (error) {
    console.error("Error in updateExam controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.exam.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteExam controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
