// questionController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        exam: true,
        unit: true,
        marks: true,
      },
    });
    res.json(questions);
  } catch (error) {
    console.error("Error in getQuestions controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const question = await prisma.question.findUnique({
      where: { id: Number(id) },
      include: {
        exam: true,
        unit: true,
        marks: true,
      },
    });
    
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    
    res.json(question);
  } catch (error) {
    console.error("Error in getQuestionById controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  const { questionText, marksAllocated, examId, unitId } = req.body;
  
  try {
    const [exam, unit] = await Promise.all([
      prisma.exam.findUnique({ where: { id: examId } }),
      prisma.unit.findUnique({ where: { id: unitId } })
    ]);

    if (!exam) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    if (!unit) {
      return res.status(400).json({ success: false, message: "Invalid unit ID" });
    }

    const newQuestion = await prisma.question.create({
      data: {
        questionText,
        marksAllocated,
        examId,
        unitId,
      },
      include: {
        exam: true,
        unit: true,
      },
    });
    
    res.status(201).json({ success: true, data: newQuestion });
  } catch (error) {
    console.error("Error in createQuestion controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { questionText, marksAllocated, examId, unitId } = req.body;
  
  try {
    const existingQuestion = await prisma.question.findUnique({
      where: { id: Number(id) }
    });

    if (!existingQuestion) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    if (examId || unitId) {
      const [exam, unit] = await Promise.all([
        examId ? prisma.exam.findUnique({ where: { id: examId } }) : null,
        unitId ? prisma.unit.findUnique({ where: { id: unitId } }) : null
      ]);

      if (examId && !exam) {
        return res.status(400).json({ success: false, message: "Invalid exam ID" });
      }

      if (unitId && !unit) {
        return res.status(400).json({ success: false, message: "Invalid unit ID" });
      }
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: Number(id) },
      data: {
        questionText,
        marksAllocated,
        examId,
        unitId,
      },
      include: {
        exam: true,
        unit: true,
      },
    });
    
    res.json({ success: true, data: updatedQuestion });
  } catch (error) {
    console.error("Error in updateQuestion controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const question = await prisma.question.findUnique({
      where: { id: Number(id) }
    });

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    await prisma.question.delete({ where: { id: Number(id) } });
    res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error in deleteQuestion controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
