import { Router } from "express";
import { dormitoryController } from "../controllers/dormitory.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

// Dormitory routes
router.get("/", validateCommonQueries(), dormitoryController.getAllDormitories);
router.get("/:id", validateId(), dormitoryController.getDormitoryById);
router.get("/:id/availability", validateId(), dormitoryController.getDormitoryAvailability);
router.get("/:id/facilities", validateId(), dormitoryController.getDormitoryFacilities);

export default router;
