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
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenHeader = req.headers.authorization;
        const token = tokenHeader === null || tokenHeader === void 0 ? void 0 : tokenHeader.split(" ")[1]; //Bearer 3492584h5h5hu43589uf4y5
        if (!token || !tokenHeader) {
            return res.status(402).json({
                message: "Sorry you are not authenticated",
            });
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (payload) {
                //@ts-ignore
                req.id = payload;
                //@ts-ignore
                next();
            }
        }
        catch (e) {
            return res.status(400).json({
                message: "Not authenticated",
            });
        }
    });
}
