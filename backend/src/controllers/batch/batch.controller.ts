import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import zod from 'zod';

const prisma = new PrismaClient();

const batchSchema = zod.object({
  batchYear: zod.number().int().min(2000).max(2100).positive("Invalid batch year"),
  courseId: zod.number().int().positive("Course ID must be a positive integer"),
});

export const createBatch = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = batchSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: result.error.format(),
      });
    }

    const { batchYear, courseId } = req.body;

    const batch = await prisma.batch.create({
      data: { batchYear, courseId },
    });

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (error) {
    console.error("Error creating batch:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllBatches = async (req: Request, res: Response): Promise<any> => {
  try {
    const batches = await prisma.batch.findMany({
      include: { course: true },
    });

    return res.status(200).json({
      success: true,
      data: batches,
    });
  } catch (error) {
    console.error("Error fetching batches:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getBatchById = async (req: Request, res: Response): Promise<any> => {
  try {
    const batchId = parseInt(req.params.batchId);
    if (isNaN(batchId)) {
      return res.status(400).json({ success: false, message: "Invalid Batch ID" });
    }

    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: { course: true },
    });

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    return res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    console.error("Error fetching batch by ID:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateBatch = async (req: Request, res: Response): Promise<any> => {
  try {
    const batchId = parseInt(req.params.batchId);
    if (isNaN(batchId)) {
      return res.status(400).json({ success: false, message: "Invalid Batch ID" });
    }

    const { batchYear } = req.body;
    if (!batchYear || batchYear < 2000 || batchYear > 2100) {
      return res.status(400).json({ success: false, message: "Invalid Batch Year" });
    }

    const updatedBatch = await prisma.batch.update({
      where: { id: batchId },
      data: { batchYear },
    });

    return res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      data: updatedBatch,
    });
  } catch (error) {
    console.error("Error updating batch:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteBatch = async (req: Request, res: Response): Promise<any> => {
  try {
    const batchId = parseInt(req.params.batchId);
    if (isNaN(batchId)) {
      return res.status(400).json({ success: false, message: "Invalid Batch ID" });
    }

    await prisma.batch.delete({ where: { id: batchId } });

    return res.status(200).json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting batch:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getBatchesByCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID" });
    }

    const batches = await prisma.batch.findMany({
      where: { courseId },
    });

    return res.status(200).json({
      success: true,
      data: batches,
    });
  } catch (error) {
    console.error("Error fetching batches by course:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getStudentsInBatch = async (req: Request, res: Response): Promise<any> => {
  try {
    const batchId = parseInt(req.params.batchId);
    if (isNaN(batchId)) {
      return res.status(400).json({ success: false, message: "Invalid Batch ID" });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { batchId },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: enrollments.map((enrollment) => enrollment.student),
    });
  } catch (error) {
    console.error("Error fetching students in batch:", (error as Error).message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
