import { Router } from "express";
import * as admissionMethodController from "../controllers/admission-method.controller";
import { admissionMethodValidators } from "../../middlewares/validators/admission-method.validator";
import { validateId } from "../../middlewares/validators/zod.validator";

const router = Router();

// Admission method routes
// GET routes
router.get("/", admissionMethodValidators.query, admissionMethodController.getAllAdmissionMethods);

// No need to validate majorCode as it's a string
router.get("/major/:majorCode", admissionMethodController.getAdmissionMethodsByMajor);

// Validate ID param
router.get("/:id", validateId, admissionMethodController.getAdmissionMethodById);
router.get("/:id/requirements", validateId, admissionMethodController.getAdmissionMethodRequirements);
router.get("/:id/majors", validateId, admissionMethodController.getMajorsByAdmissionMethod);

// POST routes
router.post("/", admissionMethodValidators.create, admissionMethodController.createAdmissionMethod);
router.post("/associate-major", admissionMethodValidators.associateMajor, admissionMethodController.associateMajorWithAdmissionMethod);
router.post("/global-application", admissionMethodValidators.globalApplication, admissionMethodController.createGlobalAdmissionMethodApplication);

// PUT route - Update existing admission method
router.put("/:id", validateId, admissionMethodValidators.update, admissionMethodController.updateAdmissionMethod);

// DELETE route - Delete admission method
router.delete("/:id", validateId, admissionMethodController.deleteAdmissionMethod);

export default router;
