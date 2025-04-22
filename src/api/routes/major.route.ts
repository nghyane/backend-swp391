import { Router } from "express";
import * as majorController from "../controllers/major.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

// Major routes
router.get("/", validateCommonQueries(), majorController.getAllMajors); // Supports filtering via query parameters
router.get("/campus/:campusId", validateId("campusId"), majorController.getMajorsByCampus);
router.get("/:code", majorController.getMajorByCode); // Get major details by code instead of ID

export default router;
