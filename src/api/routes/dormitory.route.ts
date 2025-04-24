import { Router } from "express";
import * as dormitoryController from "../controllers/dormitory.controller";
import { dormitoryValidators } from "../../middlewares/validators/dormitory.validator";
import { validateId } from "../../middlewares/validators/zod.validator";

const router = Router();

// Dormitory routes - GET
router.get("/", dormitoryValidators.query, dormitoryController.getAllDormitories);
router.get("/:id", validateId, dormitoryController.getDormitoryById);
router.get("/:id/availability", validateId, dormitoryController.getDormitoryAvailability);
router.get("/:id/facilities", validateId, dormitoryController.getDormitoryFacilities);

// Dormitory routes - CRUD operations
router.post("/", dormitoryValidators.create, dormitoryController.createDormitory);
router.put("/:id", validateId, dormitoryValidators.update, dormitoryController.updateDormitory);
router.delete("/:id", validateId, dormitoryController.deleteDormitory);

export default router;
