// questionController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany();
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
      where: { id: Number(id) }
    });
    res.json(question);
  } catch (error) {
    console.error("Error in getQuestionById controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  const { questionNumber, examId } = req.body;
  try {
    const newQuestion = await prisma.question.create({
      data: { questionNumber, examId }
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error in createQuestion controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { questionNumber, examId } = req.body;
  try {
    const updatedQuestion = await prisma.question.update({
      where: { id: Number(id) },
      data: { questionNumber, examId }
    });
    res.json(updatedQuestion);
  } catch (error) {
    console.error("Error in updateQuestion controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.question.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteQuestion controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
