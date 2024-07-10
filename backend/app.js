import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import db from "./config/mongoose.js";
import errorHandler from "./middlewares/errorHandler.js";
import { authenticate } from "./middlewares/authentication.js";
import authRouter from "./routers/auth.js";
import topicRouter from "./routers/topic.js";
import commentRouter from "./routers/comment.js";

db();

const app = e();

app.use(
    cors({
        origin: [
            "https://marstakiler-forum.vercel.app/",
            "http://localhost:3000/",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);
app.use(e.json());
app.use(e.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(authenticate);

app.use("/auth", authRouter);
app.use("/topics", topicRouter);
app.use("/comments", commentRouter);

app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
