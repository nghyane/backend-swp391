import { Router } from "express";
import { admissionMethodController } from "../controllers/admission-method.controller";
import { validateIdParam } from "../../middlewares/validators";

const router = Router();

// Admission method routes
router.get("/", admissionMethodController.getAllAdmissionMethods);
router.get("/major/:majorId", validateIdParam("majorId"), admissionMethodController.getAdmissionMethodsByMajor);
router.get("/:id", validateIdParam(), admissionMethodController.getAdmissionMethodById);
router.get("/:id/requirements", validateIdParam(), admissionMethodController.getAdmissionMethodRequirements);

export default router;
