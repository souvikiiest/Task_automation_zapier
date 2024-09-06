import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const TOPIC_NAME = "zap-events";
const prisma = new PrismaClient();
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});
async function main() {
  const producer = kafka.producer();
  await producer.connect();

  while (true) {
    const pendingEvents = await prisma.zapRunOutbox.findMany({
      where: {},
      take: 10,
    });
    producer.send({
      topic: TOPIC_NAME,
      messages: pendingEvents.map((pending) => ({
        value: pending.zapRunId,
      })),
    });

    await prisma.zapRunOutbox.deleteMany({
      where: {
        id: {
          in: pendingEvents.map((pending) => pending.id),
        },
      },
    });
  }
}
main();
