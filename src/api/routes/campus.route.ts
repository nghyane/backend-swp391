import { Router } from "express";
import { campusController } from "../controllers/campus.controller";

const router = Router();

// Campus routes
router.get("/", campusController.getAllCampuses);
router.get("/:id", campusController.getCampusById);

export default router;
