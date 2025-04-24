import { Router } from "express";
import * as scholarshipController from "../controllers/scholarship.controller";
import { scholarshipValidators } from "../../middlewares/validators/scholarship.validator";
import { validateId } from "../../middlewares/validators/zod.validator";

const router = Router();

// Scholarship routes - GET
router.get("/", scholarshipValidators.query, scholarshipController.getAllScholarships);

// Không cần validate majorCode vì đây là string
router.get("/major/:majorCode", scholarshipController.getScholarshipsByMajor);

// Validate ID param
router.get("/:id", validateId, scholarshipController.getScholarshipById);

// Scholarship routes - CRUD operations
router.post("/", scholarshipValidators.create, scholarshipController.createScholarship);
router.put("/:id", validateId, scholarshipValidators.update, scholarshipController.updateScholarship);
router.delete("/:id", validateId, scholarshipController.deleteScholarship);

export default router;
