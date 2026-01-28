import express from "express";
import authRouter from "./routes/auth.routes";
import contentRouter from "./routes/content.routes";
import tagRouter from "./routes/tag.routes";
import shareRouter from "./routes/share.routes";
import profileRouter from "./routes/profile.routes";
import billingRouter from "./routes/billing.routes";
import searchRouter from "./routes/search.routes";

const app = express();

app.use(express.json());

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/share", shareRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/billing", billingRouter);
app.use("/api/v1/search", searchRouter);

export default app;