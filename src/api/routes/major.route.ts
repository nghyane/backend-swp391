import { Router } from "express";
import * as majorController from "../controllers/major.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

// Major routes
router.get("/", validateCommonQueries(), majorController.getAllMajors); // Supports filtering via query parameters
router.get("/campus/:campusId", validateId("campusId"), majorController.getMajorsByCampus);
router.get("/:id", validateId(), majorController.getMajorById);

export default router;
