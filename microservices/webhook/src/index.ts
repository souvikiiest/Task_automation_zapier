import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const body = req.body;
  const { userId, zapId } = req.params;

  //We need a transaction for the event to occur i.e post into zapRun and zaprunoutbox together.
  await prisma.$transaction(async (tx) => {
    const zapRunres = await tx.zapRun.create({
      data: {
        zapId,
        metadata: body,
      },
    });
    const outbox = await tx.zapRunOutbox.create({
      data: {
        zapRunId: zapRunres.id,
      },
    });
  });
  res.send("Zap created successfully");
});

app.listen(3002, () => {
  console.log("listening on port: 3002");
});
