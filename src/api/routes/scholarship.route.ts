import { Router } from "express";
import { scholarshipController } from "../controllers/scholarship.controller";
import { validateIdParam, validateQueryParams } from "../../middlewares/validators";

const router = Router();

// Scholarship routes
router.get("/", 
  validateQueryParams([
    { name: 'name', type: 'string' },
    { name: 'majorId', type: 'int' },
    { name: 'campusId', type: 'int' },
    { name: 'minAmount', type: 'int' }
  ]),
  scholarshipController.getAllScholarships
);
router.post("/eligibility", scholarshipController.getScholarshipsByEligibility);
router.get("/major/:majorId", validateIdParam("majorId"), scholarshipController.getScholarshipsByMajor);
router.get("/:id", validateIdParam(), scholarshipController.getScholarshipById);

export default router;
