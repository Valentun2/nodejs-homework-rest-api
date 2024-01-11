import { Router } from "express";
import { authenticate, isEmptyBody,upload} from "../middlewares/index.js";
import { authSchema,  } from "../models/user.js";
import  controllers from "../controllers/authentication.js";
import validateBody from "../decorators/validateBody.js";
const router = Router();

router.post("/register",isEmptyBody, validateBody(authSchema), controllers.register)
router.post("/login", isEmptyBody,validateBody(authSchema),controllers.login)
router.get("/current",authenticate, controllers.currentUser);
router.post("/logout",authenticate,controllers.logout)
router.patch("/avatars",authenticate, upload.single('avatar'),   controllers.updateAvatar)
export default router;
