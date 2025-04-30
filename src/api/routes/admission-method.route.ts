import { Router } from "express";
import * as admissionMethodController from "../controllers/admission-method.controller";
import { admissionMethodValidators } from "../../middlewares/validators/admission-method.validator";
import { validateId } from "../../middlewares/validators/zod.validator";

const router = Router();

/**
 * @swagger
 * /admission-methods:
 *   get:
 *     summary: Lấy danh sách phương thức xét tuyển
 *     tags: [Admission Methods]
 *     parameters:
 *       - $ref: '#/components/parameters/NameQuery'
 *       - $ref: '#/components/parameters/MajorIdQuery'
 *       - $ref: '#/components/parameters/MajorCodeQuery'
 *       - $ref: '#/components/parameters/CampusIdQuery'
 *       - $ref: '#/components/parameters/CampusCodeQuery'
 *       - $ref: '#/components/parameters/AcademicYearQuery'
 *       - $ref: '#/components/parameters/IsActiveQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.get("/", admissionMethodValidators.query, admissionMethodController.getAllAdmissionMethods);

/**
 * @swagger
 * /admission-methods/major/{majorCode}:
 *   get:
 *     summary: Lấy danh sách phương thức xét tuyển theo mã ngành
 *     tags: [Admission Methods]
 *     parameters:
 *       - $ref: '#/components/parameters/MajorCodeParam'
 *       - $ref: '#/components/parameters/AcademicYearQuery'
 *       - $ref: '#/components/parameters/IsActiveQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/major/:majorCode", admissionMethodController.getAdmissionMethodsByMajor);

/**
 * @swagger
 * /admission-methods/{id}:
 *   get:
 *     summary: Lấy thông tin phương thức xét tuyển theo ID
 *     tags: [Admission Methods]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/:id", validateId, admissionMethodController.getAdmissionMethodById);

/**
 * @swagger
 * /admission-methods/{id}/requirements:
 *   get:
 *     summary: Lấy yêu cầu của phương thức xét tuyển
 *     tags: [Admission Methods]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/:id/requirements", validateId, admissionMethodController.getAdmissionMethodRequirements);

/**
 * @swagger
 * /admission-methods/{id}/majors:
 *   get:
 *     summary: Lấy danh sách ngành học theo phương thức xét tuyển
 *     tags: [Admission Methods]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *       - $ref: '#/components/parameters/AcademicYearQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/:id/majors", validateId, admissionMethodController.getMajorsByAdmissionMethod);

/**
 * @swagger
 * /admission-methods:
 *   post:
 *     summary: Tạo phương thức xét tuyển mới
 *     tags: [Admission Methods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdmissionMethod'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.post("/", admissionMethodValidators.create, admissionMethodController.createAdmissionMethod);

/**
 * @swagger
 * /admission-methods/associate-major:
 *   post:
 *     summary: Liên kết ngành học với phương thức xét tuyển
 *     tags: [Admission Methods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admission_method_id
 *               - major_id
 *             properties:
 *               admission_method_id:
 *                 type: integer
 *               major_id:
 *                 type: integer
 *     responses:
 *       201:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post("/associate-major", admissionMethodValidators.associateMajor, admissionMethodController.associateMajorWithAdmissionMethod);

/**
 * @swagger
 * /admission-methods/global-application:
 *   post:
 *     summary: Tạo đơn xét tuyển toàn cầu
 *     tags: [Admission Methods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_info:
 *                 type: object
 *               admission_method_id:
 *                 type: integer
 *               majors:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.post("/global-application", admissionMethodValidators.globalApplication, admissionMethodController.createGlobalAdmissionMethodApplication);

/**
 * @swagger
 * /admission-methods/{id}:
 *   put:
 *     summary: Cập nhật thông tin phương thức xét tuyển
 *     tags: [Admission Methods]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdmissionMethod'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put("/:id", validateId, admissionMethodValidators.update, admissionMethodController.updateAdmissionMethod);

/**
 * @swagger
 * /admission-methods/{id}:
 *   delete:
 *     summary: Xóa phương thức xét tuyển
 *     tags: [Admission Methods]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete("/:id", validateId, admissionMethodController.deleteAdmissionMethod);

export default router;
