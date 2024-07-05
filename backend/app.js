// app.js
import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import db from "./config/mongoose.js";
db();

const app = e();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(e.json());
app.use(e.urlencoded({ extended: false }));
app.use(cookieParser());

import authRouter from "./routers/auth.js";
import topicRouter from "./routers/topic.js";
import commentRouter from "./routers/comment.js";
import { authenticate } from "./middlewares/authentication.js";

app.use((req, res, next) => {
    console.log("GELEN REQ BODY: ", JSON.stringify(req.body));
    console.log("GELEN REQ HEADER: ", JSON.stringify(req.headers));
    next();
});

app.use(authenticate);
app.use("/auth", authRouter);
app.use("/topics", topicRouter);
app.use("/comment", commentRouter);
app.use((err, req, res, next) => {
    console.error(err); // Hata detaylarını loglayın
    if (!res.headersSent) {
        res.status(err.status || 500).json({
            success: false,
            errors: err.message || "Birşeyler ters gitti",
        });
    }
});
app.listen(4000, () => {
    console.log("Sunucu 4000 portu üzerinde başlatıldı");
});
