import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
const router = Router();

router.get("/available", async (req, res) => {
  const triggers = await prisma.avialableTrigger.findMany({});

  return res.json(triggers);
});

// to fetch the metadata of zap(trigger) from the ZapRun table

router.post("/fetchMetadata", authMiddleware, async (req, res) => {
  const body = req.body;

  //@ts-ignore
  const userId = req.id;
  try {
    const metadata = await prisma.zapRun.findFirst({
      where: {
        zapId: body.zapId,
      },
      select: {
        metadata: true,
      },
    });

    return res.status(200).json(metadata);
  } catch (e) {
    return res.status(400).json({
      message: "Some error occured please try again",
    });
  }
});

export const triggerRouter = router;
