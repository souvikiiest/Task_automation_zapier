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
exports.zapRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const authMiddleware_1 = require("../middleware/authMiddleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    //@ts-ignore
    const userId = req.id;
    const parsedBody = types_1.zapCreateSchema.safeParse(body);
    if (!parsedBody.success) {
        return res.status(411).json({
            message: "Inavlid inputs",
        });
    }
    if (parsedBody.data.actions.length == 0) {
        return res.status(411).json({
            message: "At least one action is required",
        });
    }
    let zapId = "";
    yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const zapCreate = yield tx.zap.create({
            data: {
                name: parsedBody.data.name,
                userId: userId,
                triggerId: "",
                action: {
                    create: parsedBody.data.actions.map((action, index) => ({
                        availableActionId: action.availableActionId,
                        sortingOrder: index,
                    })),
                },
                time: new Date(),
            },
        });
        const trigger = yield tx.trigger.create({
            data: {
                availableTriggerId: parsedBody.data.availableTriggerId,
                zapId: zapCreate.id,
            },
        });
        zapId = zapCreate.id;
        const updateZap = yield tx.zap.update({
            where: {
                id: zapCreate.id,
            },
            data: {
                triggerId: trigger.id,
            },
        });
    }));
    return res.status(200).json({
        zapId: zapId,
        message: "Zap created successfully",
    });
}));
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.id;
    try {
        const zaps = yield db_1.prisma.zap.findMany({
            where: {
                userId: userId,
            },
            include: {
                action: {
                    include: {
                        type: true,
                    },
                },
                trigger: {
                    include: {
                        type: true,
                    },
                },
            },
        });
        return res.status(200).json(zaps);
    }
    catch (e) {
        return res.status(400).json({
            message: "Some error occured, please try again",
        });
    }
}));
router.get("/:zapId", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zapId = req.params.zapId;
    //@ts-ignore
    const userId = req.id;
    try {
        if (!zapId) {
            return res.status(400).json({ message: "Zap ID is required." });
        }
        const zap = yield db_1.prisma.zap.findFirst({
            where: {
                id: zapId,
                userId: userId,
            },
            include: {
                action: {
                    include: {
                        type: true,
                    },
                },
                trigger: {
                    include: {
                        type: true,
                    },
                },
            },
        });
        if (!zap) {
            return res
                .status(404)
                .json({ message: "Zap not found or access denied." });
        }
        return res.status(200).json(zap);
    }
    catch (e) {
        return res
            .status(500)
            .json({ message: "An internal server error occurred." });
    }
}));
exports.zapRouter = router;
