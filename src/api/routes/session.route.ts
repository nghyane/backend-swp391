import { Router } from "express";
import { sessionController } from "../controllers/session.controller";

const router = Router();

// Session routes
router.get("/facebook/:facebookUserId", sessionController.getSessionByFacebookId);
router.put("/:id", sessionController.updateSession);
router.get("/", sessionController.getAllSessions);

export default router;
