// subjectController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.json(subjects);
  } catch (error) {
    console.error("Error in getSubjects controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSubjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const subject = await prisma.subject.findUnique({ where: { id: Number(id) } });
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ error: 'Subject not found' });
    }
  } catch (error) {
    console.error("Error in getSubjectById controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createSubject = async (req: Request, res: Response) => {
  const { subjectName, semesterId } = req.body;
  try {
    const newSubject = await prisma.subject.create({
      data: { subjectName, semesterId }
    });
    res.status(201).json(newSubject);
  } catch (error) {
    console.error("Error in createSubject controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subjectName, semesterId } = req.body;
  try {
    const updatedSubject = await prisma.subject.update({
      where: { id: Number(id) },
      data: { subjectName, semesterId }
    });
    res.json(updatedSubject);
  } catch (error) {
    console.error("Error in updateSubject controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.subject.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteSubject controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
