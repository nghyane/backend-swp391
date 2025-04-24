import { Router } from "express";
import * as campusController from "../controllers/campus.controller";
import { campusValidators } from "../../middlewares/validators/campus.validator";
import { validateId } from "../../middlewares/validators/zod.validator";

const router = Router();

// Campus routes - GET
router.get("/", campusValidators.query, campusController.getAllCampuses);
router.get("/:id", validateId, campusController.getCampusById);
router.get("/:id/majors", validateId, campusController.getCampusMajors);
router.get("/:id/facilities", validateId, campusController.getCampusFacilities);

// Campus routes - CRUD operations
router.post("/", campusValidators.create, campusController.createCampus);
router.put("/:id", validateId, campusValidators.update, campusController.updateCampus);
router.delete("/:id", validateId, campusController.deleteCampus);

export default router;
