import e from "express"
const router = e.Router()

import * as comment from "../controllers/comment.js"

router.post("/", comment.addComment)


export default router