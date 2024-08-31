import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
const router = Router();

router.get("/available", async (req, res) => {
  const action = await prisma.avialableActions.findMany({});

  return res.json(action);
});

router.post("/updateActionMetadata", authMiddleware, async (req, res) => {
  const body = req.body;
  //@ts-ignore
  const userId = req.id;
  const updateRes = await prisma.action.update({
    where: {
      id: body.actionId,
      zapId: body.zapId,
    },
    data: {
      metadata: body.data,
    },
  });
  if (!updateRes) {
    return res.status(400).json({
      message: "some error occured",
    });
  }
  return res.status(200).json({
    message: "updated successfully",
  });
});

export const actionRouter = router;
