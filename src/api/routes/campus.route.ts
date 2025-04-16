import { Router } from "express";
import { campusController } from "../controllers/campus.controller";

const router = Router();

// Campus routes
router.get("/", campusController.getAllCampuses);
router.get("/:id", campusController.getCampusById);
router.get("/:id/facilities", campusController.getCampusFacilities);
router.get("/:id/location", campusController.getCampusLocation);

export default router;
