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
exports.signin = exports.signup = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = __importDefault(require("zod"));
const generateTokenAndSetCookies_1 = __importDefault(require("../../utils/generateTokenAndSetCookies"));
const prisma = new client_1.PrismaClient();
const signupSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.default.string().email("Invalid email format"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod_1.default.string(),
    role: zod_1.default.enum(["Student", "Faculty", "HOD", "Dean", "Admin"]),
    profileDetails: zod_1.default.any().optional(),
});
const signinSchema = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email format"),
    password: zod_1.default.string().min(1, "Password is required"),
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield prisma.user.create({
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
        return (0, generateTokenAndSetCookies_1.default)(user, res);
    }
    catch (error) {
        console.error("Error in signup controller", error.message);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        return (0, generateTokenAndSetCookies_1.default)(user, res);
    }
    catch (error) {
        console.error("Error in signin controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.signin = signin;
