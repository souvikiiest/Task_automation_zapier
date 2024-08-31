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
exports.userRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const authMiddleware_1 = require("../middleware/authMiddleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    try {
        const parsedBody = types_1.SignupSchema.safeParse(body);
        if (!parsedBody.success) {
            return res.status(411).json({
                message: "Incorrect inputs",
            });
        }
        const userExists = yield db_1.prisma.user.findFirst({
            where: {
                email: (_a = parsedBody.data) === null || _a === void 0 ? void 0 : _a.email,
            },
        });
        if (userExists) {
            return res.status(411).json({
                message: "User already exist. Please try again",
            });
        }
        const response = yield db_1.prisma.user.create({
            data: {
                email: parsedBody.data.email,
                password: parsedBody.data.password,
                name: parsedBody.data.name,
            },
        });
        // await sendEmail
        return res.status(200).json({
            message: "Signup successfull, Please check your email for verification",
        });
    }
    catch (e) {
        return res.status(400).json({
            message: "Some error occured, please try again",
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const body = req.body;
    const parsedBody = types_1.SigninSchema.safeParse(body);
    if (!parsedBody.success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    try {
        const userExists = yield db_1.prisma.user.findFirst({
            where: {
                email: (_a = parsedBody.data) === null || _a === void 0 ? void 0 : _a.email,
                password: (_b = parsedBody.data) === null || _b === void 0 ? void 0 : _b.password,
            },
            select: {
                id: true,
            },
        });
        if (!userExists)
            return res.status(400).json({
                message: "Incorrect credentials",
            });
        const token = jsonwebtoken_1.default.sign(userExists === null || userExists === void 0 ? void 0 : userExists.id, process.env.JWT_SECRET);
        return res.status(200).json({
            token: token,
        });
    }
    catch (e) {
        return res.status(400).json({
            message: "Some error occured, pleas etry again",
        });
    }
}));
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const user = yield db_1.prisma.user.findFirst({
        where: {
            id,
        },
        select: {
            name: true,
            email: true,
        },
    });
    return res.status(200).json({
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
    });
}));
exports.userRouter = router;
