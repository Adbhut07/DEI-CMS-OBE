import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  role: string;
}

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.cookies.jwt; // Extract token from cookie
      if (!token) {
        res.status(401).json({ message: 'Authentication token missing' });
        return; // Ensure no further execution
      }

      const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: 'Access denied' });
        return; // Ensure no further execution
      }

      // Attach user info to the request for use in controllers
      req.user = { id: decoded.userId, role: decoded.role };

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};
