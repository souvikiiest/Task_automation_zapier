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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.avialableTrigger.create({
            data: {
                name: "webhook",
                image: "https://seeklogo.com/images/W/webhooks-logo-04229CC4AE-seeklogo.com.png",
            },
        });
        yield prisma.avialableActions.createMany({
            data: [
                {
                    name: "email",
                    image: "https://cdn.pixabay.com/photo/2016/06/13/17/30/mail-1454731_640.png",
                },
                {
                    name: "send-solana",
                    image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
                },
            ],
        });
    });
}
main();
