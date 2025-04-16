import { Router } from "express";
import { tuitionController } from "../controllers/tuition.controller";

const router = Router();

// Tuition routes
router.get("/", tuitionController.getTuitionInfo);
router.get("/compare", tuitionController.compareTuition);
router.get("/major/:majorId", tuitionController.getTuitionByMajor);

export default router;
