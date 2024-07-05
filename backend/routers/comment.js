import e from "express";
const router = e.Router();

import * as comment from "../controllers/comment.js";

router.post("/", comment.addComment);
router.post("/like/:id", comment.likeCommentById);
router.post("/dislike/:id", comment.dislikeCommentById);

export default router;
