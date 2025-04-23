import { Router } from "express";
import * as campusController from "../controllers/campus.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

router.get("/", validateCommonQueries({
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 50
}), campusController.getAllCampuses);
router.get("/:id", validateId(), campusController.getCampusById);
router.get("/:id/majors", validateId(), campusController.getCampusMajors);
router.get("/:id/facilities", validateId(), campusController.getCampusFacilities);

router.post("/", campusController.createCampus);
router.put("/:id", validateId(), campusController.updateCampus);
router.delete("/:id", validateId(), campusController.deleteCampus);

export default router;
