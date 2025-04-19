import { Router } from "express";
import { tuitionController } from "../controllers/tuition.controller";

const router = Router();

// Tuition routes
router.get("/major/:majorId", tuitionController.getTuitionByMajor);

export default router;
