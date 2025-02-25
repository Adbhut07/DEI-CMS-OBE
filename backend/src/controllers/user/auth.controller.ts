import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import zod from "zod";
import generateTokenAndSetCookie from "../../utils/generateTokenAndSetCookies";

const prisma = new PrismaClient();

const signupSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Invalid email format"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: zod.string(),
  role: zod.enum(["Student", "Faculty", "HOD", "Dean", "Admin"]),
  profileDetails: zod.any().optional(), 
});

const signinSchema = zod.object({
  email: zod.string().email("Invalid email format"),
  password: zod.string().min(1, "Password is required"),
});

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { name, email, password, confirmPassword, role, profileDetails } = result.data;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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

    return generateTokenAndSetCookie(user, res);

  } catch (error) {
    console.error("Error in signup controller", (error as Error).message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const signin = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = signinSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: result.error.format(),
      });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return generateTokenAndSetCookie(user, res);
  } catch (error) {
    console.error("Error in signin controller:", (error as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

