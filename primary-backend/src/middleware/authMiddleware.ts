import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tokenHeader = req.headers.authorization;
  const token = tokenHeader?.split(" ")[1]; //Bearer 3492584h5h5hu43589uf4y5

  if (!token || !tokenHeader) {
    return res.status(402).json({
      message: "Sorry you are not authenticated",
    });
  }
  try {
    const payload = jwt.verify(token!, process.env.JWT_SECRET!);

    if (payload) {
      //@ts-ignore
      req.id = payload;
      //@ts-ignore

      next();
    }
  } catch (e) {
    return res.status(400).json({
      message: "Not authenticated",
    });
  }
}
