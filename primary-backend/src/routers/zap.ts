import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
import { zapCreateSchema } from "../types";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  const body = req.body;

  //@ts-ignore
  const userId = req.id;
  const parsedBody = zapCreateSchema.safeParse(body);

  if (!parsedBody.success) {
    return res.status(411).json({
      message: "Inavlid inputs",
    });
  }
  if (parsedBody.data.actions.length == 0) {
    return res.status(411).json({
      message: "At least one action is required",
    });
  }
  let zapId = "";
  await prisma.$transaction(async (tx) => {
    const zapCreate = await tx.zap.create({
      data: {
        name: parsedBody.data.name,
        userId: userId,
        triggerId: "",
        action: {
          create: parsedBody.data.actions.map((action, index) => ({
            availableActionId: action.availableActionId,
            sortingOrder: index,
          })),
        },
        time: new Date(),
      },
    });
    const trigger = await tx.trigger.create({
      data: {
        availableTriggerId: parsedBody.data.availableTriggerId,
        zapId: zapCreate.id,
      },
    });
    zapId = zapCreate.id;
    const updateZap = await tx.zap.update({
      where: {
        id: zapCreate.id,
      },
      data: {
        triggerId: trigger.id,
      },
    });
  });

  return res.status(200).json({
    zapId: zapId,
    message: "Zap created successfully",
  });
});

router.get("/", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.id;

  try {
    const zaps = await prisma.zap.findMany({
      where: {
        userId: userId,
      },
      include: {
        action: {
          include: {
            type: true,
          },
        },
        trigger: {
          include: {
            type: true,
          },
        },
      },
    });
    return res.status(200).json(zaps);
  } catch (e) {
    return res.status(400).json({
      message: "Some error occured, please try again",
    });
  }
});

router.get("/:zapId", authMiddleware, async (req, res) => {
  const zapId = req.params.zapId;
  //@ts-ignore
  const userId = req.id;
  try {
    if (!zapId) {
      return res.status(400).json({ message: "Zap ID is required." });
    }
    const zap = await prisma.zap.findFirst({
      where: {
        id: zapId,
        userId: userId,
      },
      include: {
        action: {
          include: {
            type: true,
          },
        },

        trigger: {
          include: {
            type: true,
          },
        },
      },
    });
    if (!zap) {
      return res
        .status(404)
        .json({ message: "Zap not found or access denied." });
    }
    return res.status(200).json(zap);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "An internal server error occurred." });
  }
});

export const zapRouter = router;
