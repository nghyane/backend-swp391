import { Router } from "express";
import { scholarshipController } from "../controllers/scholarship.controller";

const router = Router();

// Scholarship routes
router.get("/", scholarshipController.getAllScholarships);
router.post("/eligibility", scholarshipController.getScholarshipsByEligibility);
router.get("/major/:majorId", scholarshipController.getScholarshipsByMajor);
router.get("/:id", scholarshipController.getScholarshipById);

export default router;
