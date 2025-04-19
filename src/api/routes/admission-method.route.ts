import { Router } from "express";
import * as admissionMethodController from "../controllers/admission-method.controller";
import { validateId, validateCommonQueries } from "../../middlewares/validators";

const router = Router();

// Admission method routes
// GET routes
router.get("/", validateCommonQueries(), admissionMethodController.getAllAdmissionMethods);
router.get("/major/:majorId", validateId("majorId"), admissionMethodController.getAdmissionMethodsByMajor);
router.get("/:id", validateId(), admissionMethodController.getAdmissionMethodById);
router.get("/:id/requirements", validateId(), admissionMethodController.getAdmissionMethodRequirements);

// POST route - Create new admission method
router.post("/", admissionMethodController.createAdmissionMethod);

// PUT route - Update existing admission method
router.put("/:id", validateId(), admissionMethodController.updateAdmissionMethod);

// DELETE route - Delete admission method
router.delete("/:id", validateId(), admissionMethodController.deleteAdmissionMethod);

export default router;
