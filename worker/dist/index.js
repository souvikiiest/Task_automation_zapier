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
const kafkajs_1 = require("kafkajs");
const createTopic_1 = require("./createTopic");
const utils_1 = require("./utils");
const TOPIC_NAME = "zap-events";
const kafka = new kafkajs_1.Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, createTopic_1.createTopic)();
        const consumer = kafka.consumer({ groupId: "process-worker" });
        yield consumer.connect();
        yield consumer.subscribe({
            topic: TOPIC_NAME,
            fromBeginning: true,
        });
        yield consumer.run({
            autoCommit: false,
            eachMessage: ({ topic, partition, message }) => __awaiter(this, void 0, void 0, function* () {
                let zapRunId;
                if (message.value !== null && message.value !== undefined) {
                    zapRunId = message.value.toString();
                    // Rest of your processing logic
                }
                else {
                    console.warn("Received null or undefined message value");
                }
                const zapRunResponse = yield prisma.zapRun.findFirst({
                    where: {
                        id: zapRunId,
                    },
                    select: {
                        metadata: true,
                        zap: {
                            select: {
                                action: {
                                    include: {
                                        type: true,
                                    },
                                },
                            },
                        },
                    },
                });
                const metadata = zapRunResponse === null || zapRunResponse === void 0 ? void 0 : zapRunResponse.metadata;
                let actions = (zapRunResponse === null || zapRunResponse === void 0 ? void 0 : zapRunResponse.zap.action) || [];
                actions.sort((a, b) => a.sortingOrder - b.sortingOrder);
                actions.map((action) => {
                    if (action.metadata === null) {
                        console.warn(`Action metadata is null for action ID: ${action.id}`);
                        return;
                    }
                    if (action.type.name == "email" && action.metadata !== null) {
                        const newActions = (0, utils_1.replaceEmailBody)(action, metadata);
                        console.log("New email details: ", newActions);
                    }
                    else if (action.type.name == "send-solana" &&
                        action.metadata !== null) {
                        const newSolanaAction = (0, utils_1.replaceSolanaBody)(action, metadata);
                        console.log("New solana details: ", newSolanaAction);
                    }
                });
                yield new Promise((r) => setTimeout(r, 5000));
                //This is done to stop autoCommit and it should pick process from where it ended
                yield consumer.commitOffsets([
                    {
                        topic: TOPIC_NAME,
                        partition,
                        offset: (Number(message.offset) + 1).toString(),
                    },
                ]);
            }),
        });
    });
}
main();
