import e from "express";
const router = e.Router();
import * as auth from "../controllers/auth.js";
import {
    checkRefreshTokenMiddleware,
    requireAuth,
    notAuth,
    checkUserId,
} from "../middlewares/authentication.js";

import existUser from "../middlewares/existUser.js";

router.get("/user", requireAuth, auth.getUser);
router.get("/user/:id", requireAuth, auth.getUserProfile);
router.put("/user/:id", requireAuth, checkUserId, auth.updateUserProfile);
router.get("/token", checkRefreshTokenMiddleware, auth.refreshToken);
router.post("/register", notAuth, existUser, auth.register);
router.post("/login", notAuth, auth.login);
router.delete("/logout", requireAuth, auth.logout);

export default router;
