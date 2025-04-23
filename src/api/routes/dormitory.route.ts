import { Router } from "express";
import { getAllDormitories, getDormitoryById, getDormitoryAvailability, getDormitoryFacilities } from "../controllers/dormitory.controller";
import { validateId, validateCommonQueries, validateDormitoryQueries } from "../../middlewares/validators";

const router = Router();

// Dormitory routes
router.get("/", validateCommonQueries({
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 50
}), validateDormitoryQueries(), getAllDormitories);
router.get("/:id", validateId(), getDormitoryById);
router.get("/:id/availability", validateId(), getDormitoryAvailability);
router.get("/:id/facilities", validateId(), getDormitoryFacilities);

export default router;
