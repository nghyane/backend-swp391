import { Router } from "express";
import { admissionMethodController } from "../controllers/admission-method.controller";

const router = Router();

// Admission method routes
router.get("/", admissionMethodController.getAllAdmissionMethods);
router.get("/major/:majorId", admissionMethodController.getAdmissionMethodsByMajor);
router.get("/:id", admissionMethodController.getAdmissionMethodById);
router.get("/:id/requirements", admissionMethodController.getAdmissionMethodRequirements);

export default router;
