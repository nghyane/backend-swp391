import { Router } from "express";
import { scholarshipController } from "../controllers/scholarship.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

// Scholarship routes
router.get("/", 
  validateCommonQueries(),
  scholarshipController.getAllScholarships
);
router.post("/eligibility", scholarshipController.getScholarshipsByEligibility);
router.get("/major/:majorId", validateId("majorId"), scholarshipController.getScholarshipsByMajor);
router.get("/:id", validateId(), scholarshipController.getScholarshipById);

export default router;
