import e from "express";
const router = e.Router();
import { requireAuth } from "../middlewares/authentication.js";

import * as topic from "../controllers/topic.js";

router.get("/", topic.getAllTopic);
router.get("/:id", topic.getTopic);
router.use(requireAuth);
router.post("/", topic.addTopic);
router.delete("/:id", topic.deleteTopic);
router.post("/like/:id", topic.likeTopicById);
router.post("/dislike/:id", topic.dislikeTopicById);

export default router;
