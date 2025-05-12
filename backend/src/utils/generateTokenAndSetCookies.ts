import jwt from 'jsonwebtoken';
import { Response } from 'express';

interface User {
  id: number;
  role: string;
  [key: string]: any; // Allows additional fields
}

const generateTokenAndSetCookie = (user: User, res: Response): void => {
    const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
  
    if (JWT_SECRET === "default-secret-key" && process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is not set!");
    }
  
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });
  
    const { password, profileDetails, ...userWithoutSensitiveData } = user;
  
    res
      .cookie("jwt", token, {
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true, // Use true for security
        sameSite: "strict", // Prevent CSRF attacks
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      })
      .status(200)
      .json({
        success: true,
        data: {
          user: userWithoutSensitiveData,
          token,
        },
        message: "Signed in successfully",
      });
  };
  
export default generateTokenAndSetCookie;
  

