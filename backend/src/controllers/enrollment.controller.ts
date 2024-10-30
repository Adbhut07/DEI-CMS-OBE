// enrollmentController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany();
    res.json(enrollments);
  } catch (error) {
    console.error("Error in getEnrollments controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getEnrollmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: Number(id) }
    });
    res.json(enrollment);
  } catch (error) {
    console.error("Error in getEnrollmentById controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createEnrollment = async (req: Request, res: Response) => {
  const { studentId, courseId, semesterId, subjectId } = req.body;
  try {
    const newEnrollment = await prisma.enrollment.create({
      data: { studentId, courseId, semesterId, subjectId }
    });
    res.status(201).json(newEnrollment);
  } catch (error) {
    console.error("Error in createEnrollment controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteEnrollment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.enrollment.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteEnrollment controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateEnrollment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { studentId, courseId, semesterId, subjectId } = req.body;
  try {
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: Number(id) },
      data: { studentId, courseId, semesterId, subjectId }
    });
    res.json(updatedEnrollment);
  } catch (error) {
    console.error("Error in updateEnrollment controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};