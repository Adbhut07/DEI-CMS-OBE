import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error in capturePayment controller:", (error as Error).message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        console.error("Error in getUserById controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, profileDetails } = req.body;
        const newUser = await prisma.user.create({
            data: { name, email, password, role, profileDetails }
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error in createUser controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.json(updatedUser);
    } catch (error) {
        console.error("Error in updateUser controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: Number(id) } });
        res.status(204).end();
    } catch (error) {
        console.error("Error in deleteUser controller:", (error as Error).message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

