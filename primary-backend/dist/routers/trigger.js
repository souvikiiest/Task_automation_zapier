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
exports.triggerRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/available", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const triggers = yield db_1.prisma.avialableTrigger.findMany({});
    return res.json(triggers);
}));
// to fetch the metadata of zap(trigger) from the ZapRun table
router.post("/fetchMetadata", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    //@ts-ignore
    const userId = req.id;
    try {
        const metadata = yield db_1.prisma.zapRun.findFirst({
            where: {
                zapId: body.zapId,
            },
            select: {
                metadata: true,
            },
        });
        return res.status(200).json(metadata);
    }
    catch (e) {
        return res.status(400).json({
            message: "Some error occured please try again",
        });
    }
}));
exports.triggerRouter = router;
