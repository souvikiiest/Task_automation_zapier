import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
import { SigninSchema, SignupSchema } from "../types";
const router = Router();

router.post("/signup", async (req, res) => {
  const body = req.body;

  try {
    const parsedBody = SignupSchema.safeParse(body);

    if (!parsedBody.success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    const userExists = await prisma.user.findFirst({
      where: {
        email: parsedBody.data?.email,
      },
    });
    if (userExists) {
      return res.status(411).json({
        message: "User already exist. Please try again",
      });
    }
    const response = await prisma.user.create({
      data: {
        email: parsedBody.data!.email,
        password: parsedBody.data!.password,
        name: parsedBody.data!.name,
      },
    });
    // await sendEmail
    return res.status(200).json({
      message: "Signup successfull, Please check your email for verification",
    });
  } catch (e) {
    return res.status(400).json({
      message: "Some error occured, please try again",
    });
  }
});

router.post("/signin", async (req, res) => {
  const body = req.body;
  const parsedBody = SigninSchema.safeParse(body);
  if (!parsedBody.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  try {
    const userExists = await prisma.user.findFirst({
      where: {
        email: parsedBody.data?.email,
        password: parsedBody.data?.password,
      },
      select: {
        id: true,
      },
    });
    if (!userExists)
      return res.status(400).json({
        message: "Incorrect credentials",
      });
    const token = jwt.sign(userExists?.id!, process.env.JWT_SECRET!);
    return res.status(200).json({
      token: token,
    });
  } catch (e) {
    return res.status(400).json({
      message: "Some error occured, pleas etry again",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  //@ts-ignore
  const id = req.id;
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return res.status(200).json({
    name: user?.name,
    email: user?.email,
  });
});

export const userRouter = router;
