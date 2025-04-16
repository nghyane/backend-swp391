import { Router } from "express";
import { majorController } from "../controllers/major.controller";

const router = Router();

// Major routes
router.get("/", majorController.getAllMajors);
router.get("/search", majorController.searchMajors);
router.get("/campus/:campusId", majorController.getMajorsByCampus);
router.get("/:id", majorController.getMajorById);

export default router;
