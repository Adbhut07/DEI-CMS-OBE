"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.getUserByEmail = exports.deleteUser = exports.getUsers = exports.createUser = exports.updateUserProfile = exports.getUsersByRole = exports.getUserProfile = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const createUserSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.default.string().email("Invalid email format"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
    role: zod_1.default.enum(["Student", "Faculty", "HOD", "Dean", "Admin"]),
    profileDetails: zod_1.default.any().optional(),
});
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield prisma.user.findUnique({
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
    }
    catch (error) {
        console.error("Error in getUserProfile:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getUserProfile = getUserProfile;
//create a controller function getting users according to their role
const getUsersByRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.params;
        const users = yield prisma.user.findMany({
            where: { role: role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profileDetails: true,
                createdAt: true,
            },
        });
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found with the specified role",
            });
        }
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        console.error("Error in getUsersByRole:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getUsersByRole = getUsersByRole;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { name, email, profileDetails } = req.body;
        const existingUser = yield prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const updatedUser = yield prisma.user.update({
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
    }
    catch (error) {
        console.error("Error in updateUserProfile:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.updateUserProfile = updateUserProfile;
//create a controller function for creating a user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }
        const user = yield prisma.user.create({
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
    }
    catch (error) {
        console.error("Error in createUser:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.createUser = createUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
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
    }
    catch (error) {
        console.error("Error in getUsers:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getUsers = getUsers;
//create a controller function for deleting a user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const existingUser = yield prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        yield prisma.user.delete({
            where: { id: parseInt(userId) },
        });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        console.error("Error in deleteUser:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.deleteUser = deleteUser;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.params.email;
        const user = yield prisma.user.findUnique({
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
    }
    catch (error) {
        console.error("Error in getUserByEmail:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getUserByEmail = getUserByEmail;
//create an api controller for updating the user role
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        const existingUser = yield prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const updatedUser = yield prisma.user.update({
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
    }
    catch (error) {
        console.error("Error in updateUserRole:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.updateUserRole = updateUserRole;
