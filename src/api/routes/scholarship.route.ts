import { Router } from "express";
import * as scholarshipController from "../controllers/scholarship.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

// Scholarship routes
router.get("/", 
  validateCommonQueries(),
  scholarshipController.getAllScholarships
);
router.post("/eligibility", scholarshipController.getScholarshipsByEligibility);
router.get("/major/:majorCode", scholarshipController.getScholarshipsByMajor);
router.get("/:id", validateId(), scholarshipController.getScholarshipById);

export default router;
