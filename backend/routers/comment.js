import e from "express";
const router = e.Router();
import { requireAuth } from "../middlewares/authentication.js";
import * as comment from "../controllers/comment.js";

router.use(requireAuth);
router.post("/like/:id", comment.likeCommentById);
router.post("/dislike/:id", comment.dislikeCommentById);
router.post("/:id", comment.addComment);

export default router;
