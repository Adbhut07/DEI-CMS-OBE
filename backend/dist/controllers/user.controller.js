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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        console.error("Error in capturePayment controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prisma.user.findUnique({ where: { id: Number(id) } });
        if (user)
            res.json(user);
        else
            res.status(404).json({ message: 'User not found' });
    }
    catch (error) {
        console.error("Error in getUserById controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role, profileDetails } = req.body;
        const newUser = yield prisma.user.create({
            data: { name, email, password, role, profileDetails }
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error in createUser controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedUser = yield prisma.user.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error("Error in updateUser controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.user.delete({ where: { id: Number(id) } });
        res.status(204).end();
    }
    catch (error) {
        console.error("Error in deleteUser controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
