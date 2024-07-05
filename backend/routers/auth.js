import e from "express"
const router = e.Router()
import * as auth from "../controllers/auth.js"
import { checkRefreshTokenMiddleware, requireAuth, notAuth } from "../middlewares/authentication.js"

import existUser from "../middlewares/existUser.js"

router.post("/register", notAuth, existUser, auth.register)
router.post("/login", notAuth, auth.login)
router.delete("/logout", requireAuth, auth.logout)
router.get("/token", checkRefreshTokenMiddleware, auth.refreshToken)

export default router