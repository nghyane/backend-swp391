import { Router } from "express";
import * as majorController from "../controllers/major.controller";
import { majorValidators } from "../../middlewares/validators/major.validator";
import { validateId, validateCampusId, validateMajorCode } from "../../middlewares/validators/zod.validator";

const router = Router();

// Major routes - Queries
router.get("/", majorValidators.query, majorController.getAllMajors);

router.get("/campus/:campus_id", validateCampusId, majorValidators.query, majorController.getMajorsByCampus);
router.get("/:major_code", validateMajorCode, majorController.getMajorByCode);

// Major routes - CRUD operations
router.post("/", majorValidators.create, majorController.createMajor);
router.put("/:id", validateId, majorValidators.update, majorController.updateMajor);
router.delete("/:id", validateId, majorController.deleteMajor);

export default router;
