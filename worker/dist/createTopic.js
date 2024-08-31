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
exports.createTopic = void 0;
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "topic-creator",
    brokers: ["localhost:9092"],
});
const admin = kafka.admin();
const createTopic = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield admin.connect();
        console.log("Connected to Kafka broker");
        yield admin.createTopics({
            topics: [
                {
                    topic: "zap-events",
                    numPartitions: 1,
                    replicationFactor: 1,
                },
            ],
        });
        console.log("Topic zap-events created successfully");
    }
    catch (error) {
        console.error("Error creating topic:", error);
    }
    finally {
        yield admin.disconnect();
    }
});
exports.createTopic = createTopic;
