import { Router } from "express";
import * as majorController from "../controllers/major.controller";
import { majorValidators } from "../../middlewares/validators/major.validator";
import { validateZod, validateId, validateCampusId } from "../../middlewares/validators/zod.validator";

const router = Router();

// Major routes - Queries
router.get("/", majorValidators.query, majorController.getAllMajors);

// Lấy majors theo campus ID
router.get("/campus/:campusId", validateCampusId, majorValidators.query, majorController.getMajorsByCampus);

// Lấy major theo code
router.get("/:code", majorValidators.query, majorController.getMajorByCode);

// Major routes - CRUD operations
router.post("/", majorValidators.create, majorController.createMajor);
router.put("/:id", validateId, majorValidators.update, majorController.updateMajor);
router.delete("/:id", validateId, majorController.deleteMajor);

export default router;
