import { Router } from "express";
import { dormitoryController } from "../controllers/dormitory.controller";

const router = Router();

// Dormitory routes
router.get("/", dormitoryController.getAllDormitories);
router.get("/:id", dormitoryController.getDormitoryById);
router.get("/:id/availability", dormitoryController.getDormitoryAvailability);
router.get("/:id/facilities", dormitoryController.getDormitoryFacilities);

export default router;
