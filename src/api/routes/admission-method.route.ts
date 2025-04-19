import { Router } from "express";
import { admissionMethodController } from "../controllers/admission-method.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

// Admission method routes
router.get("/", validateCommonQueries(), admissionMethodController.getAllAdmissionMethods);
router.get("/major/:majorId", validateId("majorId"), admissionMethodController.getAdmissionMethodsByMajor);
router.get("/:id", validateId(), admissionMethodController.getAdmissionMethodById);
router.get("/:id/requirements", validateId(), admissionMethodController.getAdmissionMethodRequirements);

export default router;
