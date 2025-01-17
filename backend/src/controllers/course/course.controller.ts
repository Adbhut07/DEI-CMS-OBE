import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import zod from "zod";

const prisma = new PrismaClient();

const unitSchema = zod.object({
  id: zod.number().optional(),
  unitNumber: zod.number().positive("Unit number must be positive"),
  description: zod.string().min(3, "Unit description must be at least 3 characters"),
});

const subjectSchema = zod.object({
  id: zod.number().optional(),
  subjectName: zod.string().min(3, "Subject name must be at least 3 characters"),
  facultyId: zod.number().positive("Faculty ID must be positive").optional(),
  units: zod.array(unitSchema).optional(),
});

const semesterSchema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(3, "Semester name must be at least 3 characters"),
  subjects: zod.array(subjectSchema).optional(),
});

const courseSchema = zod.object({
  courseName: zod.string().min(3, "Course name must be at least 3 characters"),
  semesters: zod.array(semesterSchema).optional(),
});

const updateUnitSchema = zod.object({
  unitNumber: zod.number().positive("Unit number must be positive"),
  description: zod.string().min(3, "Unit description must be at least 3 characters"),
});

const updateSubjectSchema = zod.object({
  subjectName: zod.string().min(3, "Subject name must be at least 3 characters"),
  facultyId: zod.number().positive("Faculty ID must be positive").optional(),
  units: zod.array(unitSchema).optional(),
});
const updateSemesterSchema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(3, "Semester name must be at least 3 characters"),
  subjects: zod.array(subjectSchema).optional(),
});

const updateCourseSchema = zod.object({
  courseName: zod.string().min(3, "Course name must be at least 3 characters"),
  semesters: zod.array(semesterSchema).optional(),
});

export const createCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = courseSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const createdById = req.user?.id;
    if(!createdById){
      return res.status(400).json({
        success: false,
        message: "created By Id is not present",
      });
    }

    const { courseName, semesters } = result.data;

    const course = await prisma.course.create({
      data: {
        courseName,
        createdById,
        semesters: semesters
          ? {
              create: semesters.map((semester) => ({
                name: semester.name,
                subjects: semester.subjects
                  ? {
                      create: semester.subjects.map((subject) => ({
                        subjectName: subject.subjectName,
                        facultyId: subject.facultyId,
                        units: subject.units
                          ? {
                              create: subject.units.map((unit) => ({
                                unitNumber: unit.unitNumber,
                                description: unit.description,
                              })),
                            }
                          : undefined,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        semesters: {
          include: {
            subjects: {
              include: {
                units: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully with semesters, subjects, and units",
      data: course,
    });
  } catch (error) {
    console.error("Error in createCourse:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get All Courses with Semesters and Subjects
export const getCourses = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log(req.user);
    const courses = await prisma.course.findMany({
      include: {
        semesters: {
          include: {
            subjects: {
              include: {
                units: true,
              }
            },
          },
        },
        createdBy: true,
      },
    });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error in getCourses:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Single Course with Semesters and Subjects
export const getCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        semesters: {
          include: {
            subjects: {
              include: {
                units: true,
              }
            },
          },
        },
        createdBy: true,
        Enrollment: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error in getCourse:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update Course with Semesters and Subjects
export const updateCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    const validationResult = updateCourseSchema.safeParse(req.body);
if (!validationResult.success) {
  console.error("Validation Errors:", validationResult.error.format());
  return res.status(400).json({
    success: false,
    message: "Invalid inputs",
    errors: validationResult.error.format(),
  });
}

console.log("Request Body:", JSON.stringify(req.body, null, 2));


    const { courseName, semesters } = validationResult.data;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        courseName,
        semesters: {
          upsert: semesters?.map((semester) => ({
            where: {
              id: semester.id ?? -1, // Use -1 for new semesters
            },
            create: {
              name: semester.name,
              subjects: {
                create: semester.subjects?.map((subject) => ({
                  subjectName: subject.subjectName,
                  units: {
                    create: subject.units?.map((unit) => ({
                      unitNumber: unit.unitNumber,
                      description: unit.description,
                    })),
                  },
                })),
              },
            },
            update: {
              name: semester.name,
              subjects: {
                upsert: semester.subjects?.map((subject) => ({
                  where: {
                    id: subject.id ?? -1,
                  },
                  create: {
                    subjectName: subject.subjectName,
                    units: {
                      create: subject.units?.map((unit) => ({
                        unitNumber: unit.unitNumber,
                        description: unit.description,
                      })),
                    },
                  },
                  update: {
                    subjectName: subject.subjectName,
                    units: {
                      upsert: subject.units?.map((unit) => ({
                        where: {
                          id: unit.id ?? -1,
                        },
                        create: {
                          unitNumber: unit.unitNumber,
                          description: unit.description,
                        },
                        update: {
                          unitNumber: unit.unitNumber,
                          description: unit.description,
                        },
                      })),
                    },
                  },
                })),
              },
            },
          })),
        },
      },
      include: {
        semesters: {
          include: {
            subjects: {
              include: {
                units: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully with semesters, subjects, and units",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error in updateCourse:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Course
export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);

    // First, delete all related enrollments
    await prisma.enrollment.deleteMany({
      where: { courseId: id },
    });

    // Delete all related marks for exams in the course's semesters
    await prisma.marks.deleteMany({
      where: {
        exam: {
          semester: {
            courseId: id,
          },
        },
      },
    });

    // Delete all questions for exams in the course's semesters
    await prisma.question.deleteMany({
      where: {
        exam: {
          semester: {
            courseId: id,
          },
        },
      },
    });

    // Delete all exams in the course's semesters
    await prisma.exam.deleteMany({
      where: {
        semester: {
          courseId: id,
        },
      },
    });

    // Delete all course outcomes for subjects in the course's semesters
    await prisma.courseOutcome.deleteMany({
      where: {
        Subject: {
          semester: {
            courseId: id,
          },
        },
      },
    });

    // Delete all units for subjects in the course's semesters
    await prisma.unit.deleteMany({
      where: {
        subject: {
          semester: {
            courseId: id,
          },
        },
      },
    });

    // Delete all subjects in the course's semesters
    await prisma.subject.deleteMany({
      where: {
        semester: {
          courseId: id,
        },
      },
    });

    // Delete all semesters for the course
    await prisma.semester.deleteMany({
      where: { courseId: id },
    });

    // Finally, delete the course itself
    await prisma.course.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Course and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteCourse:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};