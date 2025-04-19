import { Router } from "express";
import { campusController } from "../controllers/campus.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

// Campus routes
router.get("/", validateCommonQueries(), campusController.getAllCampuses);
router.get("/:id", validateId(), campusController.getCampusById);

export default router;
