import { PrismaClient } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { Kafka } from "kafkajs";
import { replaceEmailBody, replaceSolanaBody } from "./utils";

const TOPIC_NAME = "zap-events";
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});
const prisma = new PrismaClient();
async function main() {
  const consumer = kafka.consumer({ groupId: "process-worker" });
  await consumer.connect();

  await consumer.subscribe({
    topic: TOPIC_NAME,
    fromBeginning: true,
  });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      let zapRunId;
      if (message.value !== null && message.value !== undefined) {
        zapRunId = message.value.toString();
        // Rest of your processing logic
      } else {
        console.warn("Received null or undefined message value");
      }

      const zapRunResponse = await prisma.zapRun.findFirst({
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

      const metadata: JsonValue = zapRunResponse?.metadata!;
      let actions: actionType = zapRunResponse?.zap.action || [];
      actions.sort(
        (a, b) => (a.sortingOrder as number) - (b.sortingOrder as number)
      );
      actions.map((action) => {
        if (action.metadata === null) {
          console.warn(`Action metadata is null for action ID: ${action.id}`);
          return;
        }
        if (action.type.name == "email" && action.metadata !== null) {
          const newActions = replaceEmailBody(action, metadata);
          console.log("New email details: ", newActions);
        } else if (
          action.type.name == "send-solana" &&
          action.metadata !== null
        ) {
          const newSolanaAction = replaceSolanaBody(action, metadata);
          console.log("New solana details: ", newSolanaAction);
        }
      });

      await new Promise((r) => setTimeout(r, 5000));

      //This is done to stop autoCommit and it should pick process from where it ended
      await consumer.commitOffsets([
        {
          topic: TOPIC_NAME,
          partition,
          offset: (Number(message.offset) + 1).toString(),
        },
      ]);
    },
  });
}
main();

type actionType = {
  id: string;
  availableActionId: string;
  zapId: string;
  sortingOrder: Number;
  metadata: JsonValue;
  type: {
    id: string;
    name: string;
    image: string;
  };
}[];
