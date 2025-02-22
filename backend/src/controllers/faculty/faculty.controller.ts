import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAssignedSubjects = async (
  req: Request,
  res: Response
): Promise<any> => {
  const facultyId = req.user?.id;

  if (!facultyId) {
    return res
      .status(400)
      .json({ success: false, message: "User is not authenticated" });
  }

  try {
    // Check if the faculty exists
    const faculty = await prisma.user.findUnique({
      where: { id: Number(facultyId) },
      include: {
        facultySubjects: {
          include: {
            course: true,
            subject: true,
            batch: true,
          },
        },
      },
    });

    if (!faculty) {
      return res
        .status(404)
        .json({ success: false, message: "Faculty not found" });
    }

    const assignedSubjects = faculty.facultySubjects.map((assignment) => ({
      id: assignment.id,
      subject: {
        id: assignment.subject.id,
        name: assignment.subject.subjectName,
        code: assignment.subject.subjectCode,
      },
      course: {
        id: assignment.course.id,
        name: assignment.course.courseName,
      },
      batch: {
        id: assignment.batch.id,
        year: assignment.batch.batchYear,
      },
      semester: assignment.semester,
    }));

    res.json({
      success: true,
      data: assignedSubjects,
    });
  } catch (error) {
    console.error(
      "Error in getAssignedSubjects controller:",
      (error as Error).message
    );
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
