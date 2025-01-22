import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAssignedSubjects = async (req: Request, res: Response): Promise<any> => {
    const facultyId = req.user?.id;

    if (!facultyId) {
      return res.status(400).json({ success: false, message: 'User is not authenticated' });
    }
  
    try {
      // Check if the faculty exists
      const faculty = await prisma.user.findUnique({
        where: { id: Number(facultyId) },
        include: {
          assignedSubjects: {
            include: {
              semester: {
                include: {
                  course: true, // Include the course details
                },
              },
            },
          },
        },
      });
  
      if (!faculty) {
        return res.status(404).json({ success: false, message: 'Faculty not found' });
      }
  
      if (faculty.role !== 'Faculty') {
        return res.status(400).json({ success: false, message: 'User is not a faculty member' });
      }
  
      // Return the assigned subjects
      res.json({
        success: true,
        data: faculty.assignedSubjects,
      });
    } catch (error) {
      console.error('Error in getAssignedSubjects controller:', (error as Error).message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };