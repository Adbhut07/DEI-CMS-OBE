import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.course.findMany();
        res.json(courses);
    } catch (error) {
        console.error("Error in getCourses controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const getCourseById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const course = await prisma.course.findUnique({ where: { id: Number(id) } });
        if (course) res.json(course);
        else res.status(404).json({ message: 'Course not found' });
    } catch (error) {
        console.error("Error in getCourseById controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { courseName } = req.body;
        const newCourse = await prisma.course.create({
            data: { courseName }
        });
        res.status(201).json(newCourse);
    } catch (error) {
        console.error("Error in createCourse controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedCourse = await prisma.course.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.json(updatedCourse);
    } catch (error) {
        console.error("Error in updateCourse controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.course.delete({ where: { id: Number(id) } });
        res.status(204).end();
    } catch (error) {
        console.error("Error in deleteCourse controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

