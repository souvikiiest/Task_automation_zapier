import cors from "cors";
import express from "express";
import { actionRouter } from "./routers/action";
import { triggerRouter } from "./routers/trigger";
import { userRouter } from "./routers/user";
import { zapRouter } from "./routers/zap";
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);

app.listen(3000);
