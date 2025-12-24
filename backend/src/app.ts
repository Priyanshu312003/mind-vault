import express from "express";
import authRouter from "./routes/auth";
import contentRouter from "./routes/content";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/content", contentRouter);

export default app;