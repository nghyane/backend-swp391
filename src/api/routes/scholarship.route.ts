import { Router } from "express";
import * as scholarshipController from "../controllers/scholarship.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

// Scholarship routes
router.get("/", 
  validateCommonQueries({
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 50
  }),
  scholarshipController.getAllScholarships
);
router.get("/major/:majorCode", scholarshipController.getScholarshipsByMajor);

export default router;
