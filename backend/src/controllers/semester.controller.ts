// semesterController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSemesters = async (req: Request, res: Response) => {
  try {
    const semesters = await prisma.semester.findMany();
    res.json(semesters);
  } catch (error) {
        console.error("Error in getSemesters controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSemesterById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const semester = await prisma.semester.findUnique({ where: { id: Number(id) } });
    if (semester) {
      res.json(semester);
    } else {
      res.status(404).json({ error: 'Semester not found' });
    }
  } catch (error) {
        console.error("Error in getSemesterById controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createSemester = async (req: Request, res: Response) => {
  const { semesterName, courseId } = req.body;
  try {
    const newSemester = await prisma.semester.create({
      data: { semesterName, courseId }
    });
    res.status(201).json(newSemester);
  } catch (error) {
    console.error("Error in createSemester controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateSemester = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { semesterName, courseId } = req.body;
  try {
    const updatedSemester = await prisma.semester.update({
      where: { id: Number(id) },
      data: { semesterName, courseId }
    });
    res.json(updatedSemester);
  } catch (error) {
    console.error("Error in updateSemester controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteSemester = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.semester.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteSemester controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
