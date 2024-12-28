"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const token = req.cookies.jwt; // Extract token from cookie
            if (!token) {
                res.status(401).json({ message: 'Authentication token missing' });
                return; // Ensure no further execution
            }
            const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (!allowedRoles.includes(decoded.role)) {
                res.status(403).json({ message: 'Access denied' });
                return; // Ensure no further execution
            }
            // Attach user info to the request for use in controllers
            req.user = { id: decoded.userId, role: decoded.role };
            next(); // Proceed to the next middleware or route handler
        }
        catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};
exports.roleMiddleware = roleMiddleware;
