import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import zod from "zod";

const prisma = new PrismaClient();

const createUserSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Invalid email format"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  role: zod.enum(["Student", "Faculty", "HOD", "Dean", "Admin"]),
  profileDetails: zod.any().optional(), 
});

export const getUserProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id; 
  
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profileDetails: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error in getUserProfile:", (error as Error).message);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  export const updateUserProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id; 
      const { name, email, profileDetails } = req.body;
  
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
  
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          name,
          email,
          profileDetails: profileDetails || existingUser.profileDetails,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profileDetails: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User profile updated successfully",
      });
    } catch (error) {
      console.error("Error in updateUserProfile:", (error as Error).message);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };


//create a controller function for creating a user
export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { name, email, password, role, profileDetails } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
        profileDetails: profileDetails || {}, 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileDetails: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error in createUser:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileDetails: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error in getUsers:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//create a controller function for deleting a user
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id; 

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUser:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserByEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const userEmail = req.params.email; 

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileDetails: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in getUserByEmail:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//create an api controller for updating the user role
export const updateUserRole = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id; 
    const { role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileDetails: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User role updated successfully",
    });
  } catch (error) {
    console.error("Error in updateUserRole:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};