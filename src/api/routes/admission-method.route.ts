import { Router } from "express";
import * as admissionMethodController from "../controllers/admission-method.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

// Admission method routes
// GET routes
router.get("/", validateCommonQueries({
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 50
}), admissionMethodController.getAllAdmissionMethods);
router.get("/major/:majorCode", admissionMethodController.getAdmissionMethodsByMajor);
router.get("/:id", validateId(), admissionMethodController.getAdmissionMethodById);
router.get("/:id/requirements", validateId(), admissionMethodController.getAdmissionMethodRequirements);
router.get("/:id/majors", validateId(), admissionMethodController.getMajorsByAdmissionMethod);

// POST routes
router.post("/", admissionMethodController.createAdmissionMethod);
router.post("/associate-major", admissionMethodController.associateMajorWithAdmissionMethod);
router.post("/global-application", admissionMethodController.createGlobalAdmissionMethodApplication);

// PUT route - Update existing admission method
router.put("/:id", validateId(), admissionMethodController.updateAdmissionMethod);

// DELETE route - Delete admission method
router.delete("/:id", validateId(), admissionMethodController.deleteAdmissionMethod);

export default router;
