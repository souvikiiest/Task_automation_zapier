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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
app.post("/hooks/catch/:userId/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { userId, zapId } = req.params;
    //We need a transaction for the event to occur i.e post into zapRun and zaprunoutbox together.
    yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const zapRunres = yield tx.zapRun.create({
            data: {
                zapId,
                metadata: body,
            },
        });
        const outbox = yield tx.zapRunOutbox.create({
            data: {
                zapRunId: zapRunres.id,
            },
        });
    }));
    res.send("Zap created successfully");
}));
app.listen(3002, () => {
    console.log("listening on port: 3002");
});
