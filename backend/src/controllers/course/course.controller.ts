import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import z from "zod";

const prisma = new PrismaClient();

export const createCourseSchema = z.object({
  courseName: z.string().min(3, "Course name must be at least 3 characters long"),
  // createdById: z.number().int().positive("Invalid user ID"),
  semesters: z.array(
    z.object({
      name: z.string().min(3, "Semester name must be at least 3 characters long"),
      subjects: z.array(
        z.object({
          subjectName: z.string().min(3, "Subject name must be at least 3 characters long"),
          subjectCode: z.string().min(2, "Subject code must be at least 2 characters long"),
          facultyId: z.number().int().positive().optional(),
          units: z.array(
            z.object({
              unitNumber: z.number().int().positive("Unit number must be positive"),
              description: z.string().min(5, "Unit description must be at least 5 characters"),
            })
          ).nonempty("At least one unit is required"),
        })
      ).nonempty("At least one subject is required"),
    })
  ).nonempty("At least one semester is required"),
});

export const createCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = createCourseSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { courseName, semesters } = result.data;

    const createdById = req.user?.id;
    if(!createdById) {
      return res.status(400).json({ success: false, message: "Invalid req.user ID" });
    }

    const existingCourse = await prisma.course.findFirst({
      where: { courseName },
    });

    if (existingCourse) {
      return res.status(400).json({ message: "Course already exists" });
    }

    const course = await prisma.course.create({
      data: {
        courseName,
        createdById,
        semesters: semesters?.length
          ? {
              create: semesters.map((semester) => ({
                name: semester.name,
                subjects: semester.subjects?.length
                  ? {
                    create: semester.subjects.map((subject: any) => ({
                      subjectName: subject.subjectName,
                      subjectCode: subject.subjectCode,
                      faculty: subject.facultyId
                        ? { connect: { id: subject.facultyId } }
                        : undefined,
                      units: {
                        create: subject.units.map((unit: any) => ({
                          unitNumber: unit.unitNumber,
                          description: unit.description,
                        })),
                      },
                    })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        batches: true,
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
    const courses = await prisma.course.findMany({
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
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error in getCourses:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Single Course with Semesters and Subjects
export const getCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id },
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
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        // enrollments: {
        //   include: {
        //     student: {
        //       select: { id: true, name: true, email: true, role: true },
        //     },
        //   },
        // },
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error in getCourse:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateCourseSchema = z.object({
  courseName: z.string().min(3, "Course name must be at least 3 characters long"),
  semesters: z
    .array(
      z.object({
        id: z.number().optional(), // Optional for new semesters
        name: z.string().min(3, "Semester name must be at least 3 characters"),
        subjects: z
          .array(
            z.object({
              id: z.number().optional(), // Optional for new subjects
              subjectName: z.string().min(3, "Subject name must be at least 3 characters"),
              subjectCode: z.string().min(2, "Subject code must be at least 2 characters"),
              facultyId: z.number().optional(),
              units: z
                .array(
                  z.object({
                    id: z.number().optional(), // Optional for new units
                    unitNumber: z.number().min(1, "Unit number must be at least 1"),
                    description: z.string().min(5, "Description must be at least 5 characters"),
                  })
                )
                .optional()
                .default([]), // Default empty array if units are not provided
            })
          )
          .optional()
          .default([]), // Default empty array if subjects are not provided
      })
    )
    .optional()
    .default([]), // Default empty array if semesters are not provided
});

// Update Course with Semesters and Subjects
export const updateCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const validationResult = updateCourseSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.error("Validation Errors:", validationResult.error.format());
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: validationResult.error.format(),
      });
    }

    const { courseName, semesters } = validationResult.data;

    const existingCourse = await prisma.course.findUnique({
      where: { id },
      select: { 
        createdById: true,
        semesters: {
          include: {
            subjects: {
              include: {
                units: {
                  select: {
                    id: true,
                    attainment: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        courseName,
        createdById: existingCourse.createdById,
        semesters: {
          upsert: semesters?.map((semester) => ({
            where: { id: semester.id ?? -1 },
            create: {
              name: semester.name,
              subjects: {
                create: semester.subjects.map((subject) => ({
                  subjectName: subject.subjectName,
                  subjectCode: subject.subjectCode, 
                  facultyId: subject.facultyId, 
                  units: {
                    create: subject.units.map((unit) => ({
                      unitNumber: unit.unitNumber,
                      description: unit.description,
                      attainment: 0.0,
                    })),
                  },
                })),
              },
            },
            update: {
              name: semester.name,
              subjects: {
                upsert: semester.subjects?.map((subject) => ({
                  where: { id: subject.id ?? -1 },
                  create: {
                    subjectName: subject.subjectName,
                    subjectCode: subject.subjectCode,
                    facultyId: subject.facultyId,
                    units: {
                      create: subject.units?.map((unit) => ({
                        unitNumber: unit.unitNumber,
                        description: unit.description,
                        attainment: 0.0,
                      })),
                    },
                  },
                  update: {
                    subjectName: subject.subjectName,
                    subjectCode: subject.subjectCode,
                    facultyId: subject.facultyId,
                    units: {
                      upsert: subject.units?.map((unit) => ({
                        where: { id: unit.id ?? -1 },
                        create: {
                          unitNumber: unit.unitNumber,
                          description: unit.description,
                          attainment: 0.0,
                        },
                        update: {
                          unitNumber: unit.unitNumber,
                          description: unit.description,
                          ...(unit.id ? {} : { attainment: 0.0 })
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
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error in updateCourse:", (error as Error).message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Course
export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Start a transaction to ensure all deletions are atomic
    await prisma.$transaction(async (tx) => {
      // 1. Delete all CO_PO_Mappings related to units in this course
      await tx.cO_PO_Mapping.deleteMany({
        where: {
          courseOutcome: {
            subject: {
              semester: {
                courseId: id
              }
            }
          }
        }
      });

      // 2. Delete all CO_Attainments related to units in this course
      await tx.cO_Attainment.deleteMany({
        where: {
          co: {
            subject: {
              semester: {
                courseId: id
              }
            }
          }
        }
      });

      // 3. Delete all PO_Attainments for this course's batches
      await tx.pO_Attainment.deleteMany({
        where: {
          batch: {
            courseId: id
          }
        }
      });

      // 4. Delete all marks for questions in exams
      await tx.marks.deleteMany({
        where: {
          exam: {
            subject: {
              semester: {
                courseId: id
              }
            }
          }
        }
      });

      // 5. Delete all questions in exams
      await tx.question.deleteMany({
        where: {
          exam: {
            subject: {
              semester: {
                courseId: id
              }
            }
          }
        }
      });

      // 6. Delete all exams
      await tx.exam.deleteMany({
        where: {
          subject: {
            semester: {
              courseId: id
            }
          }
        }
      });

      // 7. Delete all units
      await tx.unit.deleteMany({
        where: {
          subject: {
            semester: {
              courseId: id
            }
          }
        }
      });

      // 8. Delete all subjects
      await tx.subject.deleteMany({
        where: {
          semester: {
            courseId: id
          }
        }
      });

      // 9. Delete all program outcomes
      await tx.programOutcome.deleteMany({
        where: {
          courseId: id
        }
      });

      // 10. Delete all enrollments in batches
      await tx.enrollment.deleteMany({
        where: {
          batch: {
            courseId: id
          }
        }
      });

      // 11. Delete all batches
      await tx.batch.deleteMany({
        where: {
          courseId: id
        }
      });

      // 12. Delete all semesters
      await tx.semester.deleteMany({
        where: {
          courseId: id
        }
      });

      // 13. Finally, delete the course itself
      await tx.course.delete({
        where: { id }
      });
    });

    return res.status(200).json({
      success: true,
      message: "Course and all related data deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message
    });
  }
};